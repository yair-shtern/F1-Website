const Footer = () => (
    <footer className="bg-f1-black text-gray-400 py-4 text-center">
      <p>© {new Date().getFullYear()} F1 Data Tracker. All rights reserved.</p>
      <p className="mt-2">
        Powered by <a href="https://ergast.com/mrd/" target="_blank" rel="noopener noreferrer" className="text-f1-blue hover:underline">Ergast Developer API</a>
      </p>
    </footer>
  );

export default Footer;