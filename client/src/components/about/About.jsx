export default function About(){
    return (
        <div className="container pt-4 pb-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-8">
            <article className="article-post">
              <p>
                I hope you like Mundana. My name is{" "}
                <a target="_blank" href=" ">
                  Sal
                </a>
                , I am the author of this template that I'm sharing you for free.
                You are currently previewing its demo, the article template to be
                more specific.
              </p>
              <p>
                Here are a few screenshots of Mundana and what you can do with it.
              </p>
              <p>
                <a href="./article.html">
                  <img
                    src="assets/img/screenshot-mundana-article.png"
                    className="shadow"
                  />
                </a>
              </p>
            </article>
            <div className="border p-5 bg-lightblue mt-5">
              <div className="row justify-content-between align-items-center">
                <div className="col-md-8 mb-2 mb-md-0">
                  <h5 className="font-weight-bold mb-3">
                    About the author of Mundana
                  </h5>
                  Hi, I'm Sal, the author of the template you're currently
                  previewing. I am sharing for free, for your personal &amp;
                  commercial use on unlimited domains. If you'd like to support my
                  work, donations are highly appreciated! You can remove the credit
                  links after donation. Thank you!
                </div>
                <div className="col-md-4">
                  <a
                    target="_blank"
                    href="https://www.buymeacoffee.com/sal"
                    className="btn btn-warning btn-block"
                  >
                    <i className="fa fa-coffee" /> Buy me a coffee
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    );
}