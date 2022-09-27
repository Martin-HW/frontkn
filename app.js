import { useState, useEffect } from "react";
import "./App.css";
import red from "../src/img/redCar.jpg";
import white from "../src/img/whiteCar.jpg";
import yellow from "../src/img/yellowCar.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import axios from "axios";
const url = "http://localhost:8080/api/parts/";
function App() {
  const [data, setData] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [partChosen, setPartChosen] = useState({
    _id: "",
    car: "",
    name: "",
    description: "",
  });

  const choosePart = (element, word) => {
    setPartChosen(element);
    word === "edit" ? setModalEdit(true) : setModalDelete(true);
  };

  const getRequest = async () => {
    await axios.get(url).then((response) => {
      setData(response.data.parts);
      //   console.log(data, "dataaaa");
    });
  };

  const putRequest = async () => {
    const request = {
      name: partChosen.name,
      description: partChosen.description,
    };
    await axios.put(url + partChosen._id, request).then((response) => {
      const newData = data.map((part) => {
        if (part._id === partChosen._id) {
          return {
            ...part,
            name: response.data.part.name,
            description: response.data.part.description,
          };
        }
        return part;
      });
      setData([...newData]);
    });
    setModalEdit(false);
  };

  const deleteRequest = async () => {
    await axios.delete(url + partChosen._id).then((response) => {
      response.data = data.filter((part) => part._id !== partChosen._id);

      setData([...response.data]);
      setModalDelete(false);
    });
  };

  const postRequest = async () => {
    await axios.post(url, partChosen).then(() => {
      //   console.log(response, "partchosennn");
      setData(data.concat(partChosen));
      setPartChosen(null);
      setModalCreate(false);
    });
  };

  useEffect(() => {
    getRequest();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartChosen((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <h2>Globant Car Company by Martin</h2>
      <br />
      <button
        className="btn btn-success"
        onClick={() => {
          setModalCreate(true);
        }}
      >
        Create
      </button>
      <br />
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Car Color</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {console.log(data, "dataqqqq")}
          {data.map((element) => (
            <tr key={element?._id}>
              {/* <td>{element?._id}</td> */}
              <td>
                <img
                  src={
                    (element.color === "white" && white) ||
                    (element.color === "red" && red) ||
                    (element.color === "yellow" && yellow)
                  }
                  alt={element.color}
                  className="myImg"
                />
              </td>
              <td>{element?.name}</td>
              <td>{element?.description}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => choosePart(element, "edit")}
                >
                  Edit
                </button>{" "}
                {"   "}
                <button
                  className="btn btn-danger"
                  onClick={() => choosePart(element, "delete")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <h3>Edit Part</h3>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            {/* <label>ID:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id"
              value={partChosen && partChosen._id}
            />
            <br /> */}

            <label>Color: (red, yellow, white)</label>
            <input
              className="form-control"
              type="text"
              name="color"
              value={partChosen && partChosen.color}
              onChange={handleChange}
            />
            <br />

            <label>Name:</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={partChosen && partChosen.name}
              onChange={handleChange}
            />
            <br />

            <label>Description:</label>
            <input
              className="form-control"
              type="text"
              name="description"
              value={partChosen && partChosen.description}
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={putRequest}>
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setModalEdit(false)}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalBody>
          <h3>Do u want to delete this car ???</h3>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => deleteRequest()}>
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalDelete(false)}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalCreate}>
        <ModalHeader>
          <h3>Create a brand-new part</h3>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            {/* <label>ID:</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id"
              value={true && null}
            />
            <br /> */}
            <label>Color: (red, yellow, white)</label>
            <input
              className="form-control"
              type="text"
              name="color"
              value={partChosen ? partChosen.color : ""}
              onChange={handleChange}
            />
            <br />
            <label>Name:</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={partChosen ? partChosen.name : ""}
              onChange={handleChange}
            />
            <br />
            <label>Description:</label>
            <input
              className="form-control"
              type="text"
              name="description"
              value={partChosen ? partChosen.description : ""}
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => postRequest()}>
            Create
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setModalCreate(false)}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
