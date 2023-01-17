import { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { random } from 'lodash';

var _ = require('lodash');

// WARNING: do not use in production!
const API_KEY = 'live_BF35vUQOF4F3gKYlpnVXK8nhz5vCnXjNGLxUUWEqgWKBikQeey9Ds9GllDXSMRhj';




export default function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [apiResponse, setApiResponse] = useState({});
  const [dataCats, setDataCats] = useState({});

  const dataBreeds = async (page, limit) => {
    let breedsCat = [];
    const dataCat = await
      fetch('https://api.thecatapi.com/v1/breeds?' + new URLSearchParams({
        api_key: API_KEY,
        page: page,
        limit: limit
      }))
        .then((res) => res.json())
        .then((data) => {
          data.forEach((elem) => breedsCat.push(elem.image.url));
        })
        .then(() => setDataCats(breedsCat));

    return breedsCat;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    setStatus('Pending');
    console.log(status);

    if (_.toNumber(input) && _.toNumber(input) < 0) {
      setStatus('Error');
      console.log('Invalid request');

      return;
    }

    try {
      // isEven
      const res = await
        fetch('https://api.isevenapi.xyz/api/iseven/' + input,
          { 'mode': 'cors' })
          .then((res) => res.json())
          .then((data) => setApiResponse(data));

      setStatus('Success');

      // Cat API
      if (input <= 12) {
        await dataBreeds(0, input);
        console.log(dataCats)
      }

    } catch (err) {
      setApiResponse({ 'error': err })
      setStatus('Error');
    }

    console.log(status);
  }

  function handleInputChange(e) {
    setStatus('Typing');
    setInput(e.target.value);
  }

  function displayResults(data) {
    if (_.isEmpty(status) || status == "Typing") return ""
    if (status == 'Pending') return "Checking..."
    if (input >= 1000000 && status == 'Error') return "Large numbers require a premium account. 😔"
    if (_.isEmpty(data) || status == 'Error') return "Something went wrong. Try again."


    if (data.iseven) {
      return "The number is ✨even✨"
    } else {
      return "The number is 😐odd😐"
    }
  }

  return (
    <div className="App">
      <div id="wrapper"
        className="flex flex-col justify-center content-center h-full gap-12 px-1">
        <header>
          <h1 className="text-4xl font-bold">#️⃣ Even number checker 🚀</h1>
          <h2 className="text-2xl">Check if a number is even! </h2>
        </header>
        <main className="flex flex-col grow-0 gap-4">
          <div id="input" className="bg-color-red">
            <form id="input-form"
              className="flex gap-2 justify-center mx-auto"
              onSubmit={handleFormSubmit}>
              <input id="input-text"
                className="text-black px-0.5"
                type="text"
                name="isEven"
                onChange={handleInputChange}
                value={input}>
              </input>
              <button
                className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 
                           focus:outline-none focus:ring focus:ring-violet-300
                           p-1.5"
                disabled={input.length == 0 || status == 'Pending'}>
                Let's go
              </button>
            </form>
          </div>
          <div id="response"
            className="h-4 grow-0 mb-8">
            <p className={_.isEmpty(input) ? "hidden" : ""}>{displayResults(apiResponse)}</p>
          </div>
          <div id="gallery"
            className={_.isEmpty(dataCats) || status != 'Success' || input > 12 ? "mx-8 hidden" : "mx-8"}>
            <div id="gallery-title">
              <h2 className="text-xl font-bold uppercase">Your number in cats 😽</h2>
              <br />
            </div>
            <div id="gallery-images"
              className="max-h-[16rem] h-full 
                        grid grid-cols-3 gap-8 mx-auto justify-items-center
                        overflow-y-scroll">
              {!_.isEmpty(dataCats) ?
                dataCats.map((elem, index) => {
                  return <img
                    className="max-h-48 border border-white border-4"
                    key={index}
                    src={elem}></img>;
                }) : ""}
            </div>
          </div>
        </main>
        <footer>

        </footer>
      </div>
    </div>
  );
}