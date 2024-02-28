import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect } from "react";
import { fetchJurisdictions } from "../api/fakeJurisdictionsApi";
import { SubjurisdictionSelector } from "./SubjurisdictionSelector";
import { v1 as uuid } from "uuid";

export type Subjurisdiction = {
  id: number;
  name: string;
  subJurisdictions?: Subjurisdiction[];
};

export function JurisdictionSelector() {
  type Jurisdictions = {
    id: number;
    name: string;
    subJurisdictions?: Subjurisdiction[];
  };

  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [jurisdictions, setJurisdictions] = useState<Jurisdictions[]>([]);
  const [jurSelector, setJurSelector] = useState<number[]>([]);

  const handleJurSelector = (e: React.ChangeEvent<HTMLInputElement>) => {
    var updatedList: number[] = [...jurSelector];
    var currVal: number = parseInt(e.target.value);
    if (e.target.checked) {
      updatedList = [...jurSelector, currVal];
    } else {
      updatedList.splice(jurSelector.indexOf(currVal), 1);
    }
    setJurSelector(updatedList);
  };

  const isChecked = (id: number): boolean => {
    return jurSelector.includes(id) ? true : false;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data: Jurisdictions[] = await fetchJurisdictions();
        //console.log(data);
        setJurisdictions(data);
      } catch (e: any) {
        console.log("Error fetching jurisdictions..");
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      {error ? (
        <span className="error">There are errors: {error.message}</span>
      ) : isLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        jurisdictions.map((jur: Jurisdictions) => (
          <span key={uuid()}>
            <div className="record">
              <input
                type="checkbox"
                value={jur.id}
                checked={isChecked(jur.id)}
                onChange={handleJurSelector}
              />
              <span style={{ paddingLeft: 10, fontWeight: "bold" }}>
                {jur.name}
              </span>
            </div>

            {isChecked(jur.id) ? (
              <SubjurisdictionSelector key={uuid()} id={jur.id} depth={1} />
            ) : (
              <></>
            )}
          </span>
        ))
      )}
    </div>
  );
}
