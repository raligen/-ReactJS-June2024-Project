export default function ArticleForm(){
    return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Create an Article</h5>
            <h6 className="mt-3">Write your news piece on one of the following categories:</h6>
        </div>

        <form className="mt-3"> 

        <div className="row form-group">

            <div className="col">
                <input type="text" className="form-control" placeholder="Article title"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" placeholder="Your name"/>
            </div>

            <div className="col">
            <select className="custom-select form-control" id="inputGroupSelect01">
                <option selected="">Select a category</option>
                <option value={1}>Politics</option>
                <option value={2}>Business</option>
                <option value={3}>Technology</option>
            </select>
            </div>        

        </div>

        <div className="form-group">
            <textarea className="form-control" id="exampleFormControlTextarea1" rows="6"></textarea>
        </div>
       
        <button type="submit" className="btn btn-success btn-round">
          Submit
        </button>
      
      </form>
      </div>
      </div>
    );
}


