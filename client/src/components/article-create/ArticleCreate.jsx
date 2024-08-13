import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCreateArticle } from "../../hooks/useArticles";
import { useForm } from "../../hooks/useForm";

const initialValues = {
    title:'', 
    category: '', 
    creator: '', 
    content: '', 
    description: '', 
    image_url: '',
}; 

export default function ArticleCreate(){
    const navigate = useNavigate();
    const createArticle = useCreateArticle();

    const createHandler = async (values) => {
        try {
            const { _id: articleId } = await createArticle(values)
            navigate(`/articles/${articleId}`);
        } catch(error) {
            //TODO set error state and display error
            console.log(error.message)
        }
    };

    const {
        values,
        changeHandler,
        submitHandler,
    } = useForm(initialValues, createHandler)

    return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Create an Article</h5>
        </div>

        <form onSubmit={submitHandler} className="mt-3"> 

        <div className="row form-group">

            <div className="col">
                <input type="text" className="form-control" name="title" value={values.title} onChange={changeHandler} placeholder="Article title"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="creator" value={values.creator} onChange={changeHandler} placeholder="Your name"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="image_url" value={values.image_url} onChange={changeHandler} placeholder="Provide an image url..."/>
            </div>
        
        </div>

        <div className="col">
                <input type="text" className="form-control" name="category" value={values.category} onChange={changeHandler} placeholder="Politics, Business, Health..."/>
         </div>

        <div className="form-group">
            <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="2"
                    placeholder="Short description"
                    name="description"
                    value={values.description}
                    onChange={changeHandler}
            >
            </textarea>
        </div>
        <div className="form-group">
            <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="6"
                    placeholder="Write your article here..."
                    name="content"
                    value={values.content}
                    onChange={changeHandler}
            >
            </textarea>
        </div>
       
        <button type="submit" className="btn btn-success btn-round">
          Create
        </button>
      
      </form>
      </div>
      </div>
    );
}
