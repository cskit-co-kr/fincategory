
docker build -t fincat .

docker tag fincat 175.125.92.63:5000/fincat

docker push 175.125.92.63:5000/fincat