# Wykorzystanie technologii Blockchain do przechowywania danych medycznych
Tomasz Szymanik

# Organizacje
1. Org1 (ubezpieczyciel), kolekcja: DATA
2. Org2 (uniwersytet), kolekcja: ANONYMIZED_DATA

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

# Klient

## Instalacja klienta
```shell
docker exec -it dev bash -c "cd client && npm install"
```
```shell
docker exec -it dev bash -c "cd client && npm run build"
```

## Rejestracja administratora
```shell
docker exec -it dev bash -c "node client/dist/enrollAdmin.js org1"
```

## Rejestracja użytkownika
```shell
docker exec -it dev bash -c "node client/dist/registerUser.js org1 <user-name>"
```
```shell
docker exec -it dev bash -c "node client/dist/registerUser.js org1 user1"
```

## Inicjalizacja rejestru
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.hospital initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.patient initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor initLedger"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.report initLedger"
```

## Przykład z query.js (odczyt danych)
```shell
docker exec -it dev bash -c "node client/dist/query.js <organization-name> <user-name> <contract-name> <transaction-name> <transaction-argument>"
```

## Przykład z invoke.js (aktualizacja stanu rejestru)
```shell
docker exec -it dev bash -c "node client/dist/invoke.js <organization-name> <user-name> <contract-name> <transaction-name> <transaction-argument>"
```
## Przykłady - DoctorContract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.doctor getDoctors DOCTOR_0 DOCTOR_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.doctor getDoctor DOCTOR_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor addDoctor DOCTOR_1 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M HOSPITAL_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.doctor transferDoctor DOCTOR_1 HOSPITAL_1"
```

## Przykłady - HospitalContract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.hospital getHospitals HOSPITAL_0 HOSPITAL_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.hospital getHospital HOSPITAL_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.hospital addHospital HOSPITAL_5 TestHospital5 TestCity1"
```

## Przykłady - PatientContract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getPatients PATIENT_0 PATIENT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getAnonymizedPatients PATIENT_0 PATIENT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getPatient PATIENT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.patient getAnonymizedPatient PATIENT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.patient addPatient PATIENT_2 jan.kowalski@email.com 000000000 Jan Kowalski 94021106010 1994-03-11T00:00:00.000Z M Kraków 'Łojasiewicza 11' Kraków 30-348 małopolskie"
```

## Przykłady - ReportContract
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.report getReports REPORT_0 REPORT_999"
```
```shell
docker exec -it dev bash -c "node client/dist/query.js org1 user1 medicaldata.report getReport REPORT_0"
```
```shell
docker exec -it dev bash -c "node client/dist/invoke.js org1 user1 medicaldata.report addReport REPORT_1 HOSPITAL_0 DOCTOR_0 PATIENT_0 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'"
```

# Usunięcie sieci
```shell
docker exec -it dev ./clear.sh
```
```shell
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down
```