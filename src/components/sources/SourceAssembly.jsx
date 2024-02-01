import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { FormControl } from '@mui/base';
import MultipleInputsSelector from './MultipleInputsSelector';
import MultipleOutputsSelector from './MultipleOutputsSelector';
import useBackendAPI from '../../hooks/useBackendAPI';
import { getInputEntitiesFromSourceId } from '../../store/cloning_utils';
import EnzymeMultiSelect from '../form/EnzymeMultiSelect';

// A component representing the ligation or gibson assembly of several fragments
function SourceAssembly({ sourceId, assemblyType }) {
  const inputEntities = useSelector((state) => getInputEntitiesFromSourceId(state, sourceId), shallowEqual);
  const inputEntityIds = inputEntities.map((e) => e.id);
  const { waitingMessage, sources, entities, sendPostRequest } = useBackendAPI(sourceId);
  const minimalHomologyRef = React.useRef(null);
  const allowPartialOverlapsRef = React.useRef(null);
  const circularOnlyRef = React.useRef(null);
  const [enzymes, setEnzymes] = React.useState([]);
  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      source: { input: inputEntities.map((e) => e.id) },
      sequences: inputEntities,
    };
    if (assemblyType === 'gibson_assembly') {
      const config = { params: {
        minimal_homology: minimalHomologyRef.current.value,
        circular_only: circularOnlyRef.current.checked,
      } };
      sendPostRequest('gibson_assembly', requestData, config);
    } else if (assemblyType === 'restriction_and_ligation') {
      if (enzymes.length === 0) { return; }
      requestData.source.restriction_enzymes = enzymes;
      const config = { params: {
        allow_partial_overlaps: allowPartialOverlapsRef.current.checked,
        circular_only: circularOnlyRef.current.checked,
      } };
      sendPostRequest('restriction_and_ligation', requestData, config);
    } else {
      sendPostRequest(assemblyType, requestData);
    }
  };

  return (
    <div className="assembly">
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <MultipleInputsSelector {...{
            inputEntityIds, sourceId, sourceType: assemblyType,
          }}
          />
        </FormControl>
        { (assemblyType === 'gibson_assembly') && (
        // I don't really understand why fullWidth is required here
        <FormControl fullWidth>
          <TextField
            fullWidth
            label="Minimal homology length (in bp)"
            inputRef={minimalHomologyRef}
            type="number"
            defaultValue={20}
          />
        </FormControl>
        )}
        { (assemblyType === 'restriction_and_ligation') && (
        <EnzymeMultiSelect setEnzymes={setEnzymes} />
        )}
        { ['restriction_and_ligation', 'gibson_assembly'].includes(assemblyType) && (
          <FormControl fullWidth style={{ textAlign: 'left' }}>
            <FormControlLabel fullWidth control={<Checkbox inputRef={circularOnlyRef} />} label="Circular assemblies only" />
          </FormControl>
        )}
        { assemblyType === 'restriction_and_ligation' && (
          <FormControl fullWidth style={{ textAlign: 'left' }}>
            <FormControlLabel fullWidth control={<Checkbox inputRef={allowPartialOverlapsRef} />} label="Allow partial overlaps" />
          </FormControl>
        )}
        <Button fullWidth type="submit" variant="contained">Submit</Button>
      </form>
      <div>{waitingMessage}</div>
      <MultipleOutputsSelector {...{
        sources, entities, sourceId, inputEntities,
      }}
      />
    </div>
  );
}

export default SourceAssembly;