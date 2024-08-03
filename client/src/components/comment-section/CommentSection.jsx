export default function CommentSection(){
    return (
        <div className="container">
        <div className="p-3 m-0 border-0 bd-example">
        <div className="card bg-light">
          <header className="card-header border-0 bg-transparent">
            <img
              src="https://via.placeholder.com/40x40"
              className="rounded-circle me-2"
            />
            <a className="fw-semibold text-decoration-none">JohnDoe</a>
            {/* <span class="ms-3 small text-muted">2 months ago</span> */}
          </header>
          <div className="card-body py-1">
            <form>
              <div>
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="visually-hidden"
                >
                  Comment
                </label>
                <textarea
                  className="form-control form-control-sm border border-2 rounded-1"
                  id="exampleFormControlTextarea1"
                  style={{ height: 50 }}
                  placeholder="Add a comment..."
                  minLength={3}
                  maxLength={255}
                  required=""
                  defaultValue={""}
                />
              </div>
            </form>
          </div>
          <footer className="card-footer bg-transparent border-0 text-end">
            <button className="btn btn-link btn-sm me-2 text-decoration-none">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Submit
            </button>
          </footer>
        </div>
        <aside className="d-flex justify-content-between align-items-center my-4">
          <h4 className="h6">3 Comments</h4>
        </aside>
        <article className="card bg-light">
          <header className="card-header border-0 bg-transparent d-flex align-items-center">
            <div>
              <img
                src="https://via.placeholder.com/40x40"
                className="rounded-circle me-2"
              />
              <a className="fw-semibold text-decoration-none">JohnDoe</a>
              <span className="ms-3 small text-muted">2 months ago</span>
            </div>
            <div className="dropdown ms-auto">
              <button
                className="btn btn-link text-decoration-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical" />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Report
                  </a>
                </li>
              </ul>
            </div>
          </header>
          <div className="card-body py-2 px-3">
            some text asdlaksd asndasd allal ? asdfasd lkakdaa akla akdn adnot!
          </div>
          <footer className="card-footer bg-white border-0 py-1 px-3">
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none ps-0"
            >
              <i className="bi bi-hand-thumbs-up me-1" />
              (3)
            </button>
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none"
            >
              Reply
            </button>
            <button
              type="button"
              className="btn btn-light btn-sm border rounded-4 ms-2"
            >
              <i className="bi bi-check-circle-fill text-secondary" /> Mark as answer
            </button>
          </footer>
        </article>
        <aside>
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none ms-2 my-2"
          >
            4 replies
          </button>
          <section id="comment-replies" className="ms-5 ms-md-5">
            <article className="card bg-light mb-3">
              <header className="card-header border-0 bg-transparent">
                <img
                  src="https://via.placeholder.com/30x30"
                  className="rounded-circle me-2"
                />
                <a className="fw-semibold text-decoration-none">JohnDoe</a>
                <span className="ms-3 small text-muted">2 months ago</span>
              </header>
              <div className="card-body py-2 px-3">
                some text asdlaksd asndasd allal ? asdfasd lkakdaa akla akdn adnot!
              </div>
              <footer className="card-footer bg-white border-0 py-1 px-3">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none ps-0"
                >
                  <i className="bi bi-hand-thumbs-up me-1" />
                  (3)
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none"
                >
                  Reply
                </button>
                <button
                  type="button"
                  className="btn btn-light btn-sm border rounded-4 ms-2"
                >
                  <i className="bi bi-check-circle-fill text-secondary" /> Mark as
                  answer
                </button>
              </footer>
            </article>
            <article className="card bg-light mb-3">
              <header className="card-header bg-transparent border-0">
                <img
                  src="https://via.placeholder.com/30x30"
                  className="rounded-circle me-2"
                />
                <a className="fw-semibold text-decoration-none">JohnDoe</a>
                <span className="ms-3 small text-muted">2 months ago</span>
              </header>
              <div className="card-body py-2 px-3">
                some text asdlaksd asndasd allal ? asdfasd lkakdaa akla akdn adnot!
              </div>
              <footer className="card-footer bg-white border-0 py-1 px-3">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none ps-0"
                >
                  <i className="bi bi-hand-thumbs-up me-1" />
                  (3)
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none"
                >
                  Reply
                </button>
                <button
                  type="button"
                  className="btn btn-light btn-sm border rounded-4 ms-2"
                >
                  <i className="bi bi-check-circle-fill text-secondary" /> Mark as
                  answer
                </button>
              </footer>
            </article>
            <article className="card bg-light">
              <header className="card-header border-0 bg-transparent">
                <img
                  src="https://via.placeholder.com/30x30"
                  className="rounded-circle me-2"
                />
                <a className="fw-semibold text-decoration-none">JohnDoe</a>
                <span className="ms-3 small text-muted">2 months ago</span>
              </header>
              <div className="card-body py-2 px-3">
                some text asdlaksd asndasd allal ? asdfasd lkakdaa akla akdn adnot!
              </div>
              <footer className="card-footer bg-white border-0 py-1 px-3">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none ps-0"
                >
                  <i className="bi bi-hand-thumbs-up me-1" />
                  (3)
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none"
                >
                  Reply
                </button>
                <button
                  type="button"
                  className="btn btn-light btn-sm border rounded-4 ms-2"
                >
                  <i className="bi bi-check-circle-fill text-secondary" /> Mark as
                  answer
                </button>
              </footer>
            </article>
          </section>
        </aside>
      </div>      
      </div>
    );
}