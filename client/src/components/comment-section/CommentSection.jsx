import { useForm } from "../../hooks/useForm";
import { useAuthContext } from "../../contexts/AuthContext";
import  { useCreateComment, useGetAllComments } from "../../hooks/useComments";

const initialValues = {
    comment = '',
};

export default function CommentSection(){
    const { articleId } = useParams();
    const [comments, setComments] = useGetAllComments(articleId);
    const createComment = useCreateComment();
    const

    

    const {
      changeHandler,
      submitHandler,
      values,
    } = useForm(initialValues, ({ comment }) => {
        createComment(articleId, comment);
    });


    return (
        <div className="container">
        <div className="p-3 m-0 border-0 bd-example">
        <div className="card bg-light">
          <header className="card-header border-0 bg-transparent">
            <img
              src="https://via.placeholder.com/40x40"
              className="rounded-circle me-2"
            />
            <a className="fw-semibold text-decoration-none">username</a>
            {/* <span class="ms-3 small text-muted">2 months ago</span> */}
          </header>
          <div className="card-body py-1">
            <form onSubmit={submitHandler}>
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
                  name="comment"
                  value={values.comment}
                  onChange={changeHandler}
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
          <h4 className="h6">{comments.length} Comments</h4>
        </aside>

        {comments.map(comment => (
        <article key={comment._id} className="card bg-light">
          <header className="card-header border-0 bg-transparent d-flex align-items-center">
            <div>
              <img
                src="https://via.placeholder.com/40x40"
                className="rounded-circle me-2"
              />
              <a className="fw-semibold text-decoration-none">{username}</a>
              <span className="ms-3 small text-muted">2 months ago</span>
            </div>
          </header>
          <div className="card-body py-2 px-3">
            {comment.commentText}
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
        ))}
      </div>      
      </div>
    );
}