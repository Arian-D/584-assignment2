import { useEffect, useState, useRef } from 'react'
import { utils, writeFileXLSX } from "xlsx";
import './App.css'
const files = [
  "263889__jarredgibb__rattle-drum.wav",
  "680316__turkis__mallets-on-piano-114bpm.wav",
  "641693__theflyfishingfilmmaker__bluesy-violin-repeating-lick.wav",
]

async function readFile(fileName: string) {
  const file = await fetch("test_files/" + fileName)
  // .then((resp) => resp.blob())
  // .then((content) => new File([content], fileName))
  const content = await file.blob()
  return new File([content], fileName)
}

async function callEndpoint(file: File) {
  const formData = new FormData()
  formData.append('my_audio_file', file)
  const post = await fetch("http://localhost:8086/api/file_tempo", {
    method: 'POST',
    body: formData,
  })
  return post.json()
}


const TableBody = () => {

  const [tempos, setTempos] = useState<any>([])

  useEffect(() => {
    files.map((file) => {
      readFile(file)
        .then(callEndpoint)
        .then((resp) => {
          setTempos([
            ...tempos,
            (<tr key={resp.filename}>
              <td>{resp.filename}</td>
              <td>{resp.overall_tempo}</td>
              <td>{resp.peak_1}</td>
              <td>{resp.peak_2}</td>
            </tr>)
          ])
        })
        .catch(console.error)
    })
  }, [])
  return tempos
}

function App() {
  const tbl = useRef(null);
  return (<>
    <h1>Assignment 2</h1>
    <table ref={tbl}>
      <thead>
        <tr>
        <th>File</th>
        <th>Overall Tempo</th>
        <th>Peak 1</th>
        <th>Peak 2</th>
        </tr>
      </thead>
      <tbody><TableBody /></tbody>
    </table>
    <br />
    <button onClick={() => {
      // generate workbook from table element
      const wb = utils.table_to_book(tbl.current);
      console.log(tbl.current)
      // write to XLSX
      writeFileXLSX(wb, "SheetJSReactExport.xlsx");
    }}>Export XLSX!</button>
  </>)
}
export default App;



