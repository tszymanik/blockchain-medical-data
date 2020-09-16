# Wykorzystanie technologii Blockchain do przechowywania danych medycznych
Tomasz Szymanik

# Organizacje
1. Org1 (ubezpieczyciel)
2. Org2 (uniwersytet)

# Kolekcje
1. DATA

# Sieć

## Uruchomienie kontenera dev
```shell
docker-compose build dev
```
```shell
docker-compose up -d dev
```

## Pobranie plików binarnych Hyperledger Fabric
```shell
docker exec -it dev ./bootstrap.sh -s
```

## Wygenerowanie certyfikatów
```shell
docker exec -it dev ./generate.sh
```

## Uruchomienie sieci
```shell
./start.sh
```

## Instalacja inteligentnych kontraktów chaincode
```shell
docker exec -it dev bash -c "cd chaincode && npm install"
```
```shell
docker exec -it dev bash -c "cd chaincode && npm run build"
```
```shell
./install-chaincode.sh
```


# API
```shell
docker exec -it dev bash -c "cd api && npm install"
```
```shell
docker exec -it dev bash -c "cd api && npm run build"
```
```shell
docker exec -it dev bash -c "cd api && npm run setup"
```
```shell
docker exec -it dev bash -c "cd api && npm start"
```


# Aplikacja internetowa
```shell
docker exec -it dev bash -c "cd app && npm install"
```
```shell
docker exec -it dev bash -c "cd app && npm start"
```


# Usunięcie sieci
```shell
docker exec -it dev ./clear.sh
```
```shell
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down
```
