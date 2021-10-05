import React from 'react';
import ApiKey from './ApiKey.jsx';
import logo from '../assets/logo.svg';

export default function Header() {
  return (
    <section
      id="drag"
      className="fixed inset-x-0 top-0 z-10 grid items-center h-24 grid-flow-col px-3 py-4 mb-24 border-b border-indigo-700 shadow-xl auto-cols-max bg-gradient-to-r from-indigo-900 via-indigo-400 to-pink-400"
    >
      <img src={logo} alt="logo" className="w-16 h-16" />
      <h1 className="self-end ml-2 text-indigo-100 drop-shadow-lg">API Client</h1>
      <ApiKey />
    </section>
  );
}
