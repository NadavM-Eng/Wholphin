import net from 'node:net';
const command = process.argv[2];
const args = process.argv.slice(3);
const request = command === 'tap' ? {command,x:Number(args[0]),y:Number(args[1])} : command === 'key' ? {command,code:Number(args[0])} : command === 'activate' ? {command,label:args[0]} : command === 'text' ? {command,text:args[0]} : command === 'scroll' ? {command,delta:Number(args[0] || 1)} : {command};
const response = await new Promise((resolve,reject) => {
  const socket = net.createConnection({host:'127.0.0.1',port:18666},()=>socket.write(JSON.stringify(request)+'\n'));
  let data='';
  socket.setTimeout(5000,()=>socket.destroy(new Error('Control request timed out')));
  socket.on('data',chunk=>{data+=chunk;if(data.includes('\n')){socket.end();resolve(JSON.parse(data.split('\n')[0]));}});
  socket.on('error',reject);
});
if(command==='tree') console.log(JSON.stringify(response.nodes?.filter(node=>node.focusable||node.editable||node.scrollable).map(node=>({label:node.label,x:node.x,y:node.y,w:node.w,h:node.h,focused:node.focused,editable:node.editable,scrollable:node.scrollable})),null,2));
else console.log(JSON.stringify(response));
