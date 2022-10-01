import React from 'react';
import axios from 'axios';

function SourceEnsembl({ sourceId, updateSource }) {
  const [waitingMessage, setWaitingMessage] = React.useState('');
  const [repositoryId, setRepositoryId] = React.useState('');
  const [selectedRepository, setSelectedRepository] = React.useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    const geneId = event.target.elements.gene_id.value;
    console.log(event.target.elements);
    const [upstream, downstream] = [event.target.elements.bases_downstream.value, event.target.elements.bases_upstream.value];
    setWaitingMessage('Requesting sequence to Ensembl');
    axios
      .get(`https://rest.ensembl.org/lookup/id/${geneId}?expand=1;content-type=application/json`, { repository_id: repositoryId, repository: selectedRepository })
      .then((resp) => {
        setWaitingMessage(null);
        console.log(resp.data);
      })
      .catch((error) => { setWaitingMessage(error2String(error)); });
  };

  return (
    <div className="genbank-id">
      <form onSubmit={onSubmit}>
        <h3 className="header-nodes">
          Type a unique gene identifier
        </h3>
        <p>For example: SPAPB1A10.09 or YOR058C</p>
        <input id="gene_id" type="text" value={repositoryId} onChange={(event) => setRepositoryId(event.target.value)} />
        <h3 className="header-nodes">
          Indicate how many extra basepairs to request
        </h3>
        <div>
          <label htmlFor="bases_upstream">Upstream: </label>
          <input type="number" id="bases_upstream" />
        </div>
        <div>
          <label htmlFor="bases_downstream">Donwstream: </label>
          <input type="number" id="bases_downstream" />
        </div>
        <button type="submit">Submit</button>
      </form>

      <div className="waiting-message">{waitingMessage}</div>
    </div>
  );
}

export default SourceEnsembl;
