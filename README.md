# Article Writer Tool

Clone this repository

~~~terminal
cd article-writer
~~~

Run:
~~~terminal
npm install
~~~

Create '.env' file
~~~.env
VITE_API_URL="http://127.0.0.1:8000/api"
~~~

Then start the frontend server:
~~~terminal
npm run dev
~~~

Then:
~~~terminal
cd server

pip install -r requirements.txt
~~~

Then create '.env' file
~~~.env
GOOGLE_API_KEY="<Your Api Key>"
~~~

Start the backend server:
~~~terminal
python manage.py runserver
~~~

