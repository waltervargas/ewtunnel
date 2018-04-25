# ewtunnel
Enterprise SSH Tunnel Tool Example 

## Download

[ewtunnel releases](https://github.com/waltervargas/ewtunnel/releases "ewtunnel releases")

## Usage

1. Connect via RDP/SSH to a windows machine behind a ssh bastion.

   ```
   ewtunnel.exe --bastion bastion1.example.com --remotehost windows1.example.corp --rdpopen
   ```
   
1. Connect via RDP/SSH to 2 windows machines behind a ssh bastion.
   
   ```
   ewtunnel.exe --localport 3388 --bastion bastion1.example.com --remotehost windows1.example.corp --rdpopen
   ewtunnel.exe --localport 3390 --bastion bastion1.example.com --remotehost windows2.example.corp --rdpopen
   ```

1. Connect via RDP/SSH using different user credentials
   
   ```
   ewtunnel.exe --user ANT\username --bastion bastion1.example.com --remotehost windows1.example.corp --rdpopen
   ```

1. Connect via RDP/SSH using a different port on remote host

   ```
   ewtunnel.exe --bastion bastion1.example.com --remotehost windows1.example.corp --remoteport 3388 --rdpopen
   ```
   
1. Connect via RDP/SSH using a different ssh port on the ssh bastion.

   ```
   ewtunnel.exe --bastion bastion1.example.com --bastionport 2222 --remotehost windows1.example.corp --remoteport 3388 --rdpopen
   ```
