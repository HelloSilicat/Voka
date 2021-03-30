cd assets
sudo nginx -p ../nginx/ -c nginx.conf
nohup python3 http_server.py 9991 >> http.log 2>&1 &



