const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;

class App extends React.Component {
    title = (
      <Alert variant="info">
        <b>firebase: </b>เข้าสู่ระบบเพื่อดูข้อมูล
      </Alert>
    );
    footer = (
      <div>
        By Manitchaya Thamanunpongsa <br />
        College of Computing, Khon Kaen University
      </div>
    );
    state = {
        scene: 0,
        students:[],
        stdid:"",
        stdtitle:"",
        stdfname:"",
        stdlname:"",
        stdemail:"",
        stdphone:"",
    }      

    render() {
        // var stext = JSON.stringify(this.state.students);  
        return (
          <Card>
            <Card.Header>{this.title}</Card.Header>  
            <Card.Body>
              <Button onClick={()=>this.readData()}>Read Data</Button>
              <Button onClick={()=>this.autoRead()}>Auto Read</Button>
              <div>
              <StudentTable data={this.state.students} app={this}/>  
              </div>
            </Card.Body>
            <Card.Footer>
            <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
            <TextInput label="ID" app={this} value="stdid" style={{width:120}}/>  
            <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100}} />
            <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120}}/>
            <TextInput label="สกุล" app={this} value="stdlname" style={{width:120}}/>
            <TextInput label="Email" app={this} value="stdemail" style={{width:150}} />        
            <TextInput label="Phone" app={this} value="stdphone" style={{width:120}}/>
            <Button onClick={()=>this.insertData()}>Save</Button>
            </Card.Footer>
            <Card.Footer>{this.footer}</Card.Footer>
          </Card>          
        );
    }
    render() {
        return (
            <Card>
                <Card.Header>{this.title}</Card.Header>
                <LoginBox user={this.state.user} app={this}></LoginBox>
                <Card.Body></Card.Body>
                <Card.Footer>{this.footer}</Card.Footer>
            </Card>
        );
    }
    readData(){
        db.collection("students").get().then((querySnapshot) => {
            var stdlist=[];
            querySnapshot.forEach((doc) => {
                stdlist.push({id:doc.id,... doc.data()});                
            });
            console.log(stdlist);
            this.setState({students: stdlist});
        });
    } 
    autoRead(){
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist=[];
            querySnapshot.forEach((doc) => {
                stdlist.push({id:doc.id,... doc.data()});                
            });          
            this.setState({students: stdlist});
        });
    }
    insertData(){
        db.collection("students").doc(this.state.stdid).set({
           title : this.state.stdtitle,
           fname : this.state.stdfname,
           lname : this.state.stdlname,
           phone : this.state.stdphone,
           email : this.state.stdemail,
        });
    }
    edit(std){      
        this.setState({
         stdid    : std.id,
         stdtitle : std.title,
         stdfname : std.fname,
         stdlname : std.lname,
         stdemail : std.email,
         stdphone : std.phone,
        })
    }
    delete(std){
        if(confirm("ต้องการลบข้อมูล")){
           db.collection("students").doc(std.id).delete();
        }
    }
    state = {
        scene: 0,
        user : null,
    }
    constructor(){
        super();
        firebase.auth().onAuthStateChanged((user)=>{
            if (user) {
              this.setState({user:user.toJSON()});
            }else{
              this.setState({user:null});
           }
        });    
    }
    google_login() {
        // Using a popup.
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                window.location.href = "quiz4.html"; 
            })
            .catch((error) => {
                console.error("Login failed", error);
            });
    }
    
    google_logout(){
        if (confirm("Are you sure?")) {
            firebase.auth().signOut().then(() => {
                // Redirect to the login page (first page)
                window.location.href = "login.html"; 
            });
        }
    }
    
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

const firebaseConfig = {
    apiKey: "AIzaSyD6c6vO6vOaFLg8znHe8b6q2VZsVRRGHiw",
    authDomain: "web-653380323-8.firebaseapp.com",
    projectId: "web-653380323-8",
    storageBucket: "web-653380323-8.firebasestorage.app",
    messagingSenderId: "811600783430",
    appId: "1:811600783430:web:af47382b6fffcbc9d44247",
    measurementId: "G-2WDZE6EYH4"
};
firebase.initializeApp(firebaseConfig);      
const db = firebase.firestore();
// db.collection("students").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//       console.log(`${doc.id} =>`,doc.data());
//   });
// });

function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
}
function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
} 
function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
}

function StudentTable({data, app}){
    return <table className='table'>
    <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
        </tr>
        {
          data.map((s)=><tr>
          <td>{s.id}</td>
          <td>{s.title}</td>
          <td>{s.fname}</td>
          <td>{s.lname}</td>
          <td>{s.email}</td>
          <td><EditButton std={s} app={app}/></td>
          <td><DeleteButton std={s} app={app}/></td>        
          </tr> )
        }
    </table>
}

function LoginBox(props) {
    const u = props.user;
    const app = props.app;
    if (!u) {
        return <div><Button onClick={() => app.google_login()}>Login</Button></div>
    } else {
        return <div>
            <img src={u.photoURL} />
            {u.email}<Button onClick={() => app.google_logout()}>Logout</Button></div>
    }
}
