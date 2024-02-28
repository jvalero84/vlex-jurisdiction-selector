import Spinner from "react-bootstrap/Spinner";
import { useState, useEffect } from "react";
import { Subjurisdiction } from "./JurisdictionSelector";
import { fetchSubJurisdictions } from "../api/fakeJurisdictionsApi";

type Props = {
  id: number;
  depth: number;
};

export function SubjurisdictionSelector({ id, depth }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [subJurisdictions, setSubJurisdictions] = useState<Subjurisdiction[]>(
    []
  );
  const [subJurSelector, setSubJurSelector] = useState<number[]>([]);

  const handleJurSelector = (e: React.ChangeEvent<HTMLInputElement>) => {
    var updatedList: number[] = [...subJurSelector];
    var currVal: number = parseInt(e.target.value);
    if (e.target.checked) {
      updatedList = [...subJurSelector, currVal];
    } else {
      updatedList.splice(subJurSelector.indexOf(currVal), 1);
    }
    setSubJurSelector(updatedList);
  };

  const isChecked = (id: number): boolean => {
    return subJurSelector.includes(id) ? true : false;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const data: Subjurisdiction[] = await fetchSubJurisdictions(id);
        //console.log(data);
        setSubJurisdictions(data);
      } catch (e: any) {
        console.log("Error fetching subJurisdictions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="subrecord">
      {isLoading ? (
        <Spinner
          animation="border"
          variant="primary"
          style={{ marginLeft: `${25 * depth}px` }}
        />
      ) : (
        subJurisdictions.map((subJur: Subjurisdiction) => (
          <span key={subJur.id}>
            <div style={{ marginLeft: `${25 * depth}px` }}>
              <input
                type="checkbox"
                value={subJur.id}
                checked={isChecked(subJur.id)}
                onChange={handleJurSelector}
              />
              <span style={{ paddingLeft: 10 }}>{subJur.name}</span>

              {isChecked(subJur.id) ? (
                <SubjurisdictionSelector id={subJur.id} depth={depth + 1} />
              ) : (
                <></>
              )}
            </div>
          </span>
        ))
      )}
    </div>
  );
}
