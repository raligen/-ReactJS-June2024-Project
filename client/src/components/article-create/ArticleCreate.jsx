import { useNavigate } from "react-router-dom";

import { useForm } from "../../hooks/useForm";

const initialValues = {title: '', category: {} '', name:'', text: '' }; 

export default function ArticleForm(){
    const [category, setCategory] = useState('politics');
    const navigate = useNavigate();
    const createArticle = useCreateArticle();

    const selectHandler = (e) => {
        setCategory(e.target.value);
    }

    const createHandler = async (values) => {
        try {
            const { _id: articleId } = await createArticle(values);
            navigate(`/articles/${articleId}/details`);
        } catch(err) {
            //TODO set error state and display error
            console.log(err.message)
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
            {/* <h6 className="mt-3">Create your article on one of the following categories:</h6> */}
        </div>

        <form onSubmit={submitHandler} className="mt-3"> 

        <div className="row form-group">

            <div className="col">
                <input type="text" className="form-control" name="title" value={values.title} onChange={changeHandler} placeholder="Article title"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="name" value={values.name} onChange={changeHandler} placeholder="Your name"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="imageUrl" placeholder="Provide a link to an image..."/>
            </div>
        
        </div>

        <div className="row form-group">

            <div className="col">
                <label>
                    Select a category:
                    <select className="custom-select form-control" id="inputGroupSelect01" name="category" value={values.`${{category}}`} onChange={changeHandler(selectHandler)}>
                        <option value="politics">Politics</option>
                        <option value="business">Business</option>
                        <option value="technology">Technology</option>
                    </select>
                </label>
            </div>      

        </div>

        <div className="form-group">
            <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="6"
                    name="text"
                    value={values.text}
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
