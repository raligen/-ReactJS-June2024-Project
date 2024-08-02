import ArticleHeader from "/article-header/ArticleHeader"; 


export default function Article(){
  return (
    <>
    <ArticleHeader />
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
    <div className="container pt-4 pb-4">
      <h5 className="font-weight-bold spanborder">
        <span>Read next</span>
      </h5>
      <div className="row">
        <div className="col-lg-6">
          <div className="card border-0 mb-4 box-shadow h-xl-300">
            <div
              style={{
                backgroundImage: "url(./assets/img/demo/3.jpg)",
                height: 150,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
              }}
            ></div>
            <div className="card-body px-0 pb-0 d-flex flex-column align-items-start">
              <h2 className="h4 font-weight-bold">
                <a className="text-dark" href="#">
                  Brain Stimulation Relieves Depression Symptoms
                </a>
              </h2>
              <p className="card-text">
                Researchers have found an effective target in the brain for
                electrical stimulation to improve mood in people suffering from
                depression.
              </p>
              <div>
                <small className="d-block">
                  <a className="text-muted" href="./author.html">
                    Favid Rick
                  </a>
                </small>
                <small className="text-muted">Dec 12 · 5 min read</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="flex-md-row mb-4 box-shadow h-xl-300">
            <div className="mb-3 d-flex align-items-center">
              <img height={80} src="./assets/img/demo/blog4.jpg" />
              <div className="pl-3">
                <h2 className="mb-2 h6 font-weight-bold">
                  <a className="text-dark" href="./article.html">
                    Nasa's IceSat space laser makes height maps of Earth
                  </a>
                </h2>
                <div className="card-text text-muted small">
                  Jake Bittle in LOVE/HATE
                </div>
                <small className="text-muted">Dec 12 · 5 min read</small>
              </div>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <img height={80} src="./assets/img/demo/blog5.jpg" />
              <div className="pl-3">
                <h2 className="mb-2 h6 font-weight-bold">
                  <a className="text-dark" href="./article.html">
                    Underwater museum brings hope to Lake Titicaca
                  </a>
                </h2>
                <div className="card-text text-muted small">
                  Jake Bittle in LOVE/HATE
                </div>
                <small className="text-muted">Dec 12 · 5 min read</small>
              </div>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <img height={80} src="./assets/img/demo/blog6.jpg" />
              <div className="pl-3">
                <h2 className="mb-2 h6 font-weight-bold">
                  <a className="text-dark" href="./article.html">
                    Sun-skimming probe starts calling home
                  </a>
                </h2>
                <div className="card-text text-muted small">
                  Jake Bittle in LOVE/HATE
                </div>
                <small className="text-muted">Dec 12 · 5 min read</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* End Main */}
  </>  
  );
}