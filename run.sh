cd assets
nohup python3 http_server.py 9991 >> http.log 2>&1 &

cd ..
sudo nginx -p nginx/ -c nginx.conf



