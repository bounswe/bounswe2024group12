import React from 'react';
import Navbar from './Navbar';
import Feed from './Feed';

const HomeCard = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  fetch(apiURL + "healthcheck/hc/", {method: "GET",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NTY3OTE3LCJpYXQiOjE3Mjk1MjQ3MTcsImp0aSI6ImJhOTNkYzViYjU1MjRkZjY5NTRlNGQ3ZmZhMjlmNjQ0IiwidXNlcl9pZCI6MX0.UtDAWg4kvCj0DtTteVt38ux9WhU7fMPRYKFBVIZ5XuA"
    }
  }).then((response) => response.json()).then((data) => console.log(data));
  return (
    <div>
      <Navbar />
      <Feed />
    </div>
  );
};

export default HomeCard;
