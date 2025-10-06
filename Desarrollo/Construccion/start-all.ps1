Start-Process powershell -ArgumentList "cd Server; npm run dev"
Start-Process powershell -ArgumentList "cd Backend; uvicorn app_main:app --reload"
Start-Process powershell -ArgumentList "cd Front; npm run dev"
