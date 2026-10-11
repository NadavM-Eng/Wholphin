package org.wholphin.runtime.control;

import android.app.Instrumentation;
import android.app.UiAutomation;
import android.graphics.Rect;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.accessibility.AccessibilityWindowInfo;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

/** A local test adapter for an unchanged Wholphin app. No app credentials are logged. */
public final class ControlInstrumentation extends Instrumentation {
    private UiAutomation automation;

    @Override public void onCreate(Bundle arguments) { super.onCreate(arguments); start(); }

    @Override public void onStart() {
        automation = getUiAutomation(UiAutomation.FLAG_DONT_SUPPRESS_ACCESSIBILITY_SERVICES);
        Bundle started = new Bundle();
        started.putString("stream", "Wholphin runtime control listening on guest loopback port 18666\n");
        sendStatus(0, started);
        try (ServerSocket server = new ServerSocket(18666, 8, InetAddress.getByName("127.0.0.1"))) {
            while (true) {
                try (Socket socket = server.accept()) {
                    socket.setSoTimeout(5000);
                    BufferedReader input = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                    PrintWriter output = new PrintWriter(socket.getOutputStream(), true, StandardCharsets.UTF_8);
                    String line = input.readLine();
                    if (line == null || line.length() > 8192) continue;
                    try { output.println(handle(new JSONObject(line)).toString()); }
                    catch (Exception error) { output.println(new JSONObject().put("ok", false).put("error", error.getClass().getSimpleName()).toString()); }
                }
            }
        } catch (Exception error) {
            Bundle failed = new Bundle();
            failed.putString("stream", "Runtime control stopped: " + error.getClass().getSimpleName());
            finish(1, failed);
        }
    }

    private AccessibilityNodeInfo appRoot() {
        // Compose reuses virtual nodes as menus change. Never route a click
        // using the accessibility framework's cached previous page.
        automation.clearCache();
        AccessibilityNodeInfo root = automation.getRootInActiveWindow();
        if (isWholphin(root)) return root;
        for (AccessibilityWindowInfo window : automation.getWindows()) {
            root = window.getRoot();
            if (isWholphin(root)) return root;
        }
        return null;
    }

    private boolean isWholphin(AccessibilityNodeInfo node) {
        return node != null && node.getPackageName() != null && node.getPackageName().toString().startsWith("com.github.damontecres.wholphin");
    }

    private void flatten(AccessibilityNodeInfo node, List<AccessibilityNodeInfo> nodes) {
        if (node == null) return;
        nodes.add(node);
        for (int index = 0; index < node.getChildCount(); index++) flatten(node.getChild(index), nodes);
    }

    private Rect bounds(AccessibilityNodeInfo node) { Rect rect = new Rect(); node.getBoundsInScreen(rect); return rect; }

    private String label(AccessibilityNodeInfo node) {
        if (node.isPassword()) return "";
        String own = node.getText() != null ? node.getText().toString() : node.getContentDescription() != null ? node.getContentDescription().toString() : "";
        if (!own.isEmpty()) return own;
        List<AccessibilityNodeInfo> children = new ArrayList<>(); flatten(node, children);
        StringBuilder result = new StringBuilder();
        for (AccessibilityNodeInfo child : children) {
            if (child == node || child.isPassword()) continue;
            CharSequence value = child.getText() != null ? child.getText() : child.getContentDescription();
            if (value != null && value.length() > 0) { if (result.length() > 0) result.append(" | "); result.append(value); }
        }
        return result.toString();
    }

    private void key(int code) {
        long now = SystemClock.uptimeMillis();
        automation.injectInputEvent(new KeyEvent(now, now, KeyEvent.ACTION_DOWN, code, 0), true);
        SystemClock.sleep(30);
        automation.injectInputEvent(new KeyEvent(now, SystemClock.uptimeMillis(), KeyEvent.ACTION_UP, code, 0), true);
    }

    private JSONObject handle(JSONObject request) throws Exception {
        String command = request.optString("command");
        AccessibilityNodeInfo root = appRoot();
        if (root == null) return new JSONObject().put("ok", false).put("error", "Wholphin is not visible");
        List<AccessibilityNodeInfo> nodes = new ArrayList<>(); flatten(root, nodes);
        if (command.equals("tree")) {
            JSONArray result = new JSONArray();
            for (AccessibilityNodeInfo node : nodes) {
                if (!node.isVisibleToUser()) continue;
                Rect rect = bounds(node);
                result.put(new JSONObject().put("label", label(node)).put("x", rect.left).put("y", rect.top).put("w", rect.width()).put("h", rect.height()).put("focusable", node.isFocusable()).put("focused", node.isFocused()).put("clickable", node.isClickable()).put("editable", node.isEditable()).put("scrollable", node.isScrollable()).put("range", node.getRangeInfo() != null));
            }
            return new JSONObject().put("ok", true).put("nodes", result);
        }
        if (command.equals("key")) { key(request.getInt("code")); return new JSONObject().put("ok", true); }
        if (command.equals("text")) {
            AccessibilityNodeInfo target = root.findFocus(AccessibilityNodeInfo.FOCUS_INPUT);
            if (target == null || !target.isEditable()) {
                for (AccessibilityNodeInfo node : nodes) if (node.isEditable() && node.isFocused() && node.isVisibleToUser()) { target = node; break; }
            }
            if (target == null || !target.isEditable()) return new JSONObject().put("ok", false).put("error", "No text field is focused");
            Bundle arguments = new Bundle(); arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, request.optString("text"));
            return new JSONObject().put("ok", target.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments));
        }
        if (command.equals("scroll")) {
            for (AccessibilityNodeInfo node : nodes) if (node.isScrollable() && node.isVisibleToUser()) {
                boolean moved = node.performAction(request.optInt("delta", 1) > 0 ? AccessibilityNodeInfo.ACTION_SCROLL_FORWARD : AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD);
                return new JSONObject().put("ok", moved);
            }
            return new JSONObject().put("ok", false);
        }
        AccessibilityNodeInfo target = null;
        long smallest = Long.MAX_VALUE;
        if (command.equals("tap")) {
            int x = request.getInt("x"), y = request.getInt("y");
            for (AccessibilityNodeInfo node : nodes) {
                Rect rect = bounds(node); long area = (long)rect.width() * rect.height();
                if (node.isEnabled() && node.isVisibleToUser() && (node.isFocusable() || node.isClickable() || node.getRangeInfo() != null) && rect.contains(x, y) && area > 0 && area < smallest) { target = node; smallest = area; }
            }
        } else if (command.equals("activate")) {
            String wanted = request.getString("label");
            for (AccessibilityNodeInfo node : nodes) {
                if (node.isVisibleToUser() && node.isFocusable() && label(node).contains(wanted)) {
                    Rect rect = bounds(node); long area = (long)rect.width() * rect.height();
                    if (area > 0 && area < smallest) { target = node; smallest = area; }
                }
            }
        }
        if (target == null) return new JSONObject().put("ok", false).put("error", "No control at that location");
        String targetLabel = label(target);
        AccessibilityNodeInfo.RangeInfo range = target.getRangeInfo();
        if (command.equals("tap") && range != null) {
            Rect rect = bounds(target);
            float fraction = Math.max(0f, Math.min(1f, (request.getInt("x") - rect.left) / (float)Math.max(1, rect.width())));
            Bundle arguments = new Bundle(); arguments.putFloat(AccessibilityNodeInfo.ACTION_ARGUMENT_PROGRESS_VALUE, range.getMin() + fraction * (range.getMax() - range.getMin()));
            boolean changed = target.performAction(AccessibilityNodeInfo.AccessibilityAction.ACTION_SET_PROGRESS.getId(), arguments);
            return new JSONObject().put("ok", changed).put("control", targetLabel).put("adapter", "native progress action");
        }
        if (target.isClickable() && target.performAction(AccessibilityNodeInfo.ACTION_CLICK)) return new JSONObject().put("ok", true).put("control", targetLabel).put("adapter", "native click action");
        boolean focused = target.isFocused() || target.performAction(AccessibilityNodeInfo.ACTION_FOCUS);
        if (focused) { SystemClock.sleep(50); key(KeyEvent.KEYCODE_DPAD_CENTER); }
        return new JSONObject().put("ok", focused).put("control", targetLabel).put("adapter", "native focus and D-pad center");
    }
}
