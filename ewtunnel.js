const tunnel = require('tunnel-ssh');
const program = require('commander');
const read = require('read');
const { exec } = require('child_process');
const fs = require('fs');

const username = process.env.USERDNSDOMAIN + "\\" + process.env.USERNAME;
const domain = process.env.USERDNSDOMAIN;
const user = process.env.USERNAME;
var rdp;

program
.version('0.1.0')
.option('-u, --user [user]', 'Bastion User')
.option('-l, --localhost <127.0.0.1>', 'Local host')
.option('-lp, --localport <localport>', 'Local Port', '3388')
.option('-b, --bastion <bastionhost>', 'Bastion Host')
.option('-bp, --bastionport <22>', 'Bastion Port')
.option('-r, --remotehost <remotehost>', 'Remote Host')
.option('-rp, --remoteport <3389>', 'Remote Port')
.option('-rdp, --rdpopen', 'Open mstsc.exe on given host and port')
.parse(process.argv);

read({ prompt: 'Password: ', silent: true }, function(er, password) {

    const config = {
        keepAlive: true,
        username: program.user || process.env.USERDNSDOMAIN + "\\" + process.env.USERNAME,
        host: program.bastion,
        port: program.bastionport || '22',
        dstHost: program.remotehost,
        dstPort: program.remoteport || '3389',
        localHost: program.localhost || '127.0.0.1',
        localPort: program.localport || '3388',
        tryKeyboard: true,
        password: password
    };

    const server = tunnel(config, (err, server) => {
        if(err){
            console.log(err);
            //catch configuration and startup errors here.
        } else {
            console.log("Connection Established - [" + config.host + "]");
            if (program.rdpopen) {
                console.log("Opening RDP Session to: " + config.localHost + ":" + config.localPort);
                console.log(config.localHost + ":" + config.localPort + " -> " + config.dstHost + ":" + config.dstPort);
                // creates rdp2.rdp file 
                const rdpfile = process.cwd() + "\\rdp-" + config.dstHost + ".rdp";
                console.log(rdpfile);
                fs.writeFile(rdpfile, "full address:s:localhost:3388\rusername:s:"+ user +"\rdomain:s:" + domain , function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log(rdpfile + " file was saved!");
                    fs.stat(rdpfile, function (err, stats) {
                        if (err) {
                            return console.error(err);
                        }
                        rdp = exec("mstsc " + rdpfile, {
                            cwd: process.cwd(),
                        }, (err, stdout, stderr) => {
                            if (err) console.error(err);
                        });
        
                        rdp.on('exit', () => {
                            server.close();
                            fs.unlink(rdpfile, (err) => {
                                if (err) throw err;
                                console.log(rdpfile + ': clean-up');
                                process.exit();
                            });
                        });     
                    });
                });
            }
        }
    });

    // Use a listener to handle errors outside the callback
    server.on('error', function(err){

        // Password Error
        if (err.level && err.level === "client-authentication") {
            console.log(" ");
            console.log("--");
            console.log("ERROR: [EA01] SSH AUTHENTICATION ERROR");
            console.log("--");
        }

        // Reconnection
        if (err.code && err.code === "ECONNRESET") {
            // Ignore
        }
    });

    process.on('SIGINT', function() {
        close(server);
    });

});

function close(server) {
    server.close();
    process.exit();
}
