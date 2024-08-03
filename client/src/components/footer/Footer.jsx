export default function Footer(){
  const today = new Date();
  const year = today.getFullYear();
    return (
        <div className="container mt-5">
        <footer className="bg-white border-top p-3 text-muted small">
          <div className="row align-items-center justify-content-between">
            <div>
              <span className="navbar-brand mr-2">
                <strong>NewsCreate</strong>
              </span>{" "}
              Copyright © {year}.
            </div>
            <div>
              With the help of {" "}
              <a
                target="_blank"
                className="text-secondary font-weight-bold"
                href="https://www.wowthemes.net/mundana-free-html-bootstrap-template/"
              >
                Mundana 
              </a>{" "}
              theme.
            </div>
          </div>
        </footer>
      </div>
    );
}