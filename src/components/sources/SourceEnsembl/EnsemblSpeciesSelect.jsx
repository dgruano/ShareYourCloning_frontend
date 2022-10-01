import axios from 'axios';
import React, { useEffect } from 'react';

function EnsemblSpeciesSelect({ setSelectedSpecies }) {
  // The ensembl entrypoint: https://rest.ensembl.org/lookup/id/SPAPB1A10.09?expand=1;content-type=application/json
  // https://rest.ensembl.org/sequence/region/schizosaccharomyces_pombe/I:1878009..1880726:1
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [allSpecies, setAllSpecies] = React.useState([]);
  const [divisions, setDivisions] = React.useState([]);
  const [allGenes, setAllGenes] = React.useState([]);
  const [geneName, setGeneName] = React.useState('');

  useEffect(() => {
    setWaitingMessage('Loading divisions from ensembl...');
    axios.get('https://rest.ensembl.org/info/divisions?content-type=application/json')
      .then((resp) => {
      // setAllSpecies(resp.data.species.map((s) => s.name));
        setDivisions(resp.data);
        setWaitingMessage('');
      })
      .catch(() => setWaitingMessage('Could not connect to ensembl...'));
  }, []);

  const updateSpeciesList = (e) => {
    const division = e.target.value;
    if (division === '') { setAllSpecies([]); return; }
    setWaitingMessage('Loading species from ensembl...');
    axios.get(`https://rest.ensembl.org/info/species?content-type=application/json&division=${division}`)
      .then((resp) => {
        console.log(resp.data.species);
        setAllSpecies(resp.data.species);
        setWaitingMessage('');
      })
      .catch(() => setWaitingMessage('Could not connect to ensembl...'));
  };

  const onSelectSpecies = (e) => console.log(e);

  const selectDivision = divisions.length === 0 ? null : (
    <>
      <div> Select an ensembl division:</div>
      <select id="division-data-list" onChange={updateSpeciesList}>
        <option value="" />
        {divisions.map((division) => <option key={division} value={division}>{division}</option>)}
      </select>
    </>
  );
  const selectSpecies = allSpecies.length === 0 ? null : (
    <>
      <div> Type the name of a species:</div>
      <input list="species-data-list" />
      <datalist id="species-data-list">
        {allSpecies.map((sp) => <option key={sp.name} value={sp.name} />)}
      </datalist>
    </>
  );

  const selectGene = allGenes.length === 0 ? null : (
    <>
      <div> Type the name of a gene:</div>
      <input list="genes-data-list" />
      <datalist id="genes-data-list">
        {allSpecies.map((gene) => <option key={gene.name} value={gene.name} />)}
      </datalist>
    </>
  );

  return (
    <div>
      {selectDivision}
      {selectSpecies}
      <div>{waitingMessage}</div>
    </div>
  );
}

export default EnsemblSpeciesSelect;
