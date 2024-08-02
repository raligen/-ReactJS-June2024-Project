import ReadNext from "/src/components/read-next/ReadNext";

export default function Technology(){
    return (
      <div>
        <div className="container">
        <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                <p className="text-uppercase font-weight-bold">
                  <a className="text-danger" href="./category.html">
                    Stories
                  </a>
                </p>
                <h1 className="display-4 secondfont mb-3 font-weight-bold">
                  Sterling could jump 8% if Brexit deal gets approved by UK
                  Parliament
                </h1>
                <p className="mb-3">
                  Analysts told CNBC that the currency could hit anywhere between
                  $1.35-$1.40 if the deal gets passed through the U.K. parliament.
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle"
                    src="assets/img/demo/avatar2.jpg"
                    width={70}
                  />
                  <small className="ml-2">
                    Jane Seymour{" "}
                    <span className="text-muted d-block">
                      A few hours ago · 5 min. read
                    </span>
                  </small>
                </div>
              </div>
              <div className="col-md-6 pr-0">
                <img src="./assets/img/demo/intro.jpg" />
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="container pt-4 pb-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-8">
            <article className="article-post">
              <p>
                Holy grail funding non-disclosure agreement advisor ramen
                bootstrapping ecosystem. Beta crowdfunding iteration assets business
                plan paradigm shift stealth mass market seed money rockstar niche
                market marketing buzz market.
              </p>
              <p>
                Burn rate release facebook termsheet equity technology. Interaction
                design rockstar network effects handshake creative startup direct
                mailing. Technology influencer direct mailing deployment return on
                investment seed round.
              </p>
              <p>
                Termsheet business model canvas user experience churn rate low
                hanging fruit backing iteration buyer seed money. Virality release
                launch party channels validation learning curve paradigm shift
                hypotheses conversion. Stealth leverage freemium venture startup
                business-to-business accelerator market.
              </p>
              <p>
                Freemium non-disclosure agreement lean startup bootstrapping holy
                grail ramen MVP iteration accelerator. Strategy market ramen
                leverage paradigm shift seed round entrepreneur crowdfunding social
                proof angel investor partner network virality.
              </p>
            </article>
  
      
          </div>
        </div>
      </div>
      
      <ReadNext />
      </div>
    );
}