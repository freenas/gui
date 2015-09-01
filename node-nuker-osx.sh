sudo rm -rf /usr/local/lib/node*
sudo rm -rf /usr/local/include/node*
sudo rm -rf ~{local,include,node*,npm*,.npm*}
sudo rm -rf /usr/local/bin/npm
sudo rm -rf /usr/local/bin/{node*,npm}
sudo rm -rf /usr/local/share/man/man1/node.1
sudo rm -rf /usr/local/lib/dtrace/node.d
rm -rf ~/.npm
rm -rf ~/.nvm
rm -rf ~/.cache
rm -rf ~/.node-gyp
rm -rf node_modules/
rm -rf bower_components/
rm -rf app/build/
rm -f ~/.v8flags*.json
rm -f ~/.babel.json
rm -f ~/.cache/bower
