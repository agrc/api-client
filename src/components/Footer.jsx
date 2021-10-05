import logo from '../assets/logo.svg';
// import { app } from 'electron';

export default function Footer() {
  return (
    <section className="fixed inset-x-0 bottom-0 grid items-center grid-cols-2 px-3 py-2 mt-10 text-indigo-200 bg-indigo-900">
      <div className="grid grid-flow-col auto-cols-max">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <div className="flex flex-col content-center ml-1 leading-none">
          <div>UGRC API Client</div>
          <a
            href="https://github.com/agrc/api-client/releases"
            target="_blank"
            rel="noreferrer"
            className="text-yellow-500"
          >
            {/* {app.getVersion()} */}
            v0.0.0
          </a>
        </div>
      </div>
      <div className="text-right">
        <div>Feedback</div>
        <div>GitHub</div>
      </div>
    </section>
  );
}
