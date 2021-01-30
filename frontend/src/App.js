import React, { useState, useRef, useEffect } from 'react';
import api from './services/api';
import config from './config';
import { Container, Row, Col, Jumbotron, Card, Form, Button, Alert, Table, ProgressBar, Modal } from 'react-bootstrap';

const initialItemForm = {name: '', encode: 'latin1', mode: 'html', stemming: 'false', files: []};

function App() {
  const [validated, setValidated] = useState(false);

  const [itemForm, setItemForm] = useState(initialItemForm);

  const [progressAtributes, setProgressAtributes] = useState({ value: 0, disabled: true });

  const [filenameCurrent, setFilenameCurrent] = useState("");

  const [disabledFields, setDisabledFields] = useState(false);

  const [dataTable, setDataTable] = useState([]);

  const fileInput = useRef(null);

  const [showModal, setShowModal] = useState(false);
  
  const [resultDetail, setResultDetail] = useState({});

  const [alertError, setAlertError] = useState(false);

  useEffect(() => {
    fetchCorpusList();
  }, []);

  const handleClose = () => setShowModal(false);
  
  const fetchCorpusList = async () => {
    try {
      const response = await api.get('list');
      const tableData = response.data;
      tableData.reverse()
      setDataTable([ ...tableData ]);
      setTimeout(() => {
        setProgressAtributes({
          value: 0
        })
      }, 1000);
    } catch (err) {
      setAlertError(true)
    }
  }

  const loadResultDetail = async (itemResult) => {
    const response = await api.get(`result/${itemResult.file}`);

    setShowModal(true);
    setResultDetail(response.data);
  }

  const saveCorpusInfo = async () => {
    const response = await api.post('list', {
      name: itemForm.name,
      encode: itemForm.encode,
      type: itemForm.mode
    });
    setFilenameCurrent(response.data.file);
    return response.data.file;
  }

  const submitDocCorpus = async (file, target) => {
    const data = new FormData();

    data.append("file", file);
    data.append("filename", target);
    data.append("mode", itemForm.mode);
    data.append("encode", itemForm.encode);
    data.append("stemming", itemForm.stemming);

    return new Promise((resolve, reject) => {
      api.post("save-doc", data).then((res) => {
        resolve(res)
      })
      .catch((err) => {
        alert("File Upload Error")
        clearFields()
        reject(err)
      });
    }); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return
    }

    const fileCorpusTarget = await saveCorpusInfo();

    setDisabledFields(true);
    if (!fileCorpusTarget){
      alert("Perdido a referencia do corpus no backend")
      clearFields()
      return
    }
    setValidated(true);

    const total = itemForm.files.length
    let count = 0

    setProgressAtributes({ 
      disabled: false,
      value: parseInt(Math.round((count * 100) / total)) 
    });

    for (const file of itemForm.files) {
      await submitDocCorpus(file, fileCorpusTarget);
      setProgressAtributes({
        value: parseInt(Math.round(( ++count * 100) / total)) 
      });
    }
    clearFields()
    fetchCorpusList()
  };

  const handleChange = event => {
    console.log(fileInput);
    const field = event.target.name
    setItemForm({ ...itemForm, [field]: event.target.value })
  }


  const handleChangeFile = event => {
    const field = event.target.name
    setItemForm({ ...itemForm, [field]: event.target.files })
  }

  const clearFields = () => {
    setItemForm(initialItemForm);
    setFilenameCurrent("");
    setDisabledFields(false);
    setValidated(false);
    fileInput.current.value = '';
  }

  return (
    <Container className='p-2'>
      { 
        alertError ? (
          <Alert className='text-center' variant='danger' dismissible onClose={() => setAlertError(false)}>
            Parece que houve algum erro para se conectar ao servidor :C !!!
          </Alert>
        ) : ('') 
      }
      <Jumbotron>
        <h2>Calcular Frequência de termos de um Corpus</h2>
        <Row className='p-1 my-3'>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Card.Title>Formulario de envio</Card.Title>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Corpus</Form.Label>
                    <Form.Control
                      name='name'
                      onChange={handleChange}
                      value={itemForm.name || ''}
                      required
                      disabled={disabledFields}
                      type="text"
                      placeholder="Nome do Corpus" 
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Enconde dos arquivos</Form.Label>
                    <Form.Control 
                      name='encode'
                      onChange={handleChange}
                      value={itemForm.encode || 'utf8'}
                      disabled={disabledFields}
                      required 
                      as="select"
                    >
                      <option value='utf8'>utf-8</option>
                      <option value='latin1'>latin1</option>
                      <option value='ascii'>ascii</option>
                      <option value='latin1'>windows-1252</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Tipo dos Arquivos</Form.Label>
                    <Form.Control 
                      name='mode'
                      onChange={handleChange}
                      value={itemForm.mode || 'html'}
                      disabled={disabledFields}
                      required 
                      as="select"
                    >
                      <option value='html'>Html</option>
                      <option value='txt'>Text Plain</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect3">
                    <Form.Label>Radicalização</Form.Label>
                    <Form.Control 
                      name='stemming'
                      onChange={handleChange}
                      value={itemForm.stemming}
                      disabled={disabledFields}
                      required 
                      as="select"
                    >
                      <option value='true'>Sim</option>
                      <option value='false'>Não</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.File
                      name='files'
                      ref={fileInput}
                      onChange={handleChangeFile}
                      disabled={disabledFields}
                      multiple
                      required
                      accept="text/html, text/plain"
                      id="exampleFormControlFile1" 
                      label="Arquivos do Corpus" 
                    />
                  </Form.Group>
                  <Button disabled={disabledFields} type="submit">Enviar</Button>
                  <div className='mt-3'>
                    <ProgressBar 
                      variant="success" 
                      now={progressAtributes.value} 
                    />
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} className='mt-3'>
            <Card>
              <Card.Body>
                <Card.Title>Resultados</Card.Title>
                {
                  (dataTable.length > 0) ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>Data e Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          dataTable.map((obj, idx) => (
                            <tr key={idx}>
                              <td>{idx}</td>
                              <td
                                style={{cursor: 'pointer'}}
                                onClick={() => loadResultDetail(obj)}
                              >
                                <a className='card-link'>{obj.name}</a>
                              </td>
                              <td>{obj.type}</td>
                              <td>{obj.timestamp}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant='info'>
                      Nenhum resultado para mostrar ainda :o !!!
                    </Alert>  
                  ) 
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{resultDetail.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Data: </b> {resultDetail.timestamp || ''} <br />
          <b>Encode: </b> {resultDetail.encode || ''} <br />
          <b>Tipo: </b> {resultDetail.type || ''} <br />
          <b>Quantidade de termos: </b> { Array.isArray(resultDetail.corpus) ? resultDetail.corpus.length : 0} <br />
        </Modal.Body>
        <Modal.Footer>
          <a className='btn btn-primary' download href={`${config.base_url}/result-save-xlsx/${resultDetail.file}`}>
            Salvar Dados
          </a>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
