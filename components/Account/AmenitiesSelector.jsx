import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';

export default function AmenitiySelector({ currentArr, suggestedArr, minLength, maxLength, label, placeholder, getAmeniities }) {
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState(currentArr || []);
  const [suggested, setSuggested] = useState([]);
  const [error, setError] = useState({ err: false, msg: '' });
  const inpRef = useRef(null);
  useEffect(() => {
    if (currentArr.length === 0) {
      setCurrent([]);
    } else {
      if (maxLength) {
        const uniqueArr = Array(...new Set([...current, ...currentArr]));
        if (uniqueArr.length > 15) {
          const unique = currentArr.filter((item) => {
            return !current.includes(item);
          });
          const offset = maxLength - current.length;
          setCurrent((prev) => Array(...new Set([...prev, ...unique.slice(0, offset)])));
          setError({ err: true, msg: `Only ${maxLength} Amenities can be added` });
        } else {
          setCurrent((prev) => Array(...new Set([...prev, ...currentArr])));
        }
      } else {
        setCurrent((prev) => Array(...new Set([...prev, ...currentArr])));
      }
    }
  }, [currentArr]);

  useEffect(() => {
    // Set current array if currentArr changes
    setCurrent(currentArr || []);
  }, [currentArr]);

  useEffect(() => {
    // Update parent component with current amenities
    getAmeniities(current);
  }, [current, getAmeniities]);

  useEffect(() => {
    const removeError = setTimeout(() => {
      if (error.err) setError({ err: false, msg: '' });
    }, 3000);
    return () => clearTimeout(removeError);
  }, [error]);

  function handleChange(e) {
    const { value } = e.target;
    setInput(value);
    if (value !== '') {
      const regex = new RegExp(value, 'i');
      const tempSuggested = suggestedArr.filter((item) => regex.test(item) && !current.includes(item));
      setSuggested(tempSuggested);
    } else {
      setSuggested([]);
    }

  }

  return (
    <div className="space-y-1">
      {label !== '' && <Label className='font-bold'>{label}</Label>}
      <div className="flex flex-wrap min-w-full gap-2">
        {current.length > 0 &&
          current.map((item) => {
            return (
              <div className="flex items-center justify-between text-sm py-2 pl-3 pr-2 space-x-1 bg-red-400 rounded-full text-white" key={item}>
                <h1 className="peer-hover:text-transparent">{item}</h1>
                <span
                  className="peer flex items-center justify-center cursor-pointer rounded-full w-5 h-5 text-center hover:bg-red-300/50"
                  onClick={() => {
                    if (minLength) {
                      if (current.length > minLength) setCurrent((prev) => [...prev.filter((currentItem) => currentItem !== item)]);
                      else
                        setError((prev) => {
                          return {
                            ...prev,
                            err: true,
                            msg: `Need at least ${minLength} Amenitiy`,
                          };
                        });
                    } else {
                      setCurrent((prev) => [...prev.filter((currentItem) => currentItem !== item)]);
                    }
                  }}
                >
                  <span className={`absolute bg-white w-[11px] h-[1px]  transfrom-all duration-300 rotate-[42deg]`}></span>
                  <span className={`absolute bg-white w-[11px] h-[1px]  transfrom-all duration-300 -rotate-[42deg]`}></span>
                </span>
              </div>
            );
          })}
      </div>
      {/* Error message */}
      <p className={`transition-colors duration-500 ${error.err ? 'text-red-500' : 'text-white'}`}>{error.msg}</p>
      {/* Form */}
      <div className="min-w-full flex items-center justify-center space-y-2">
        <div className="min-w-full flex space-y-2">
          <Input ref={inpRef} onChange={handleChange} className="customInput my-1" placeholder={placeholder || ''} value={input} />
        </div>
        {suggested.length === 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();

            }}
            className="h-0 w-0 "
          ></button>
        )}
      </div>
      {/* Suggested  */}
      {suggested.length > 0 &&
        suggested.slice(0, 5).map((item) => {
          return (
            <div className="flex justify-between" key={item}>
              <h1>{item}</h1>
              <Button
                onClick={() => {
                  if (maxLength) {
                    if (current.length < maxLength) {
                      setCurrent((prev) => Array(...new Set([...prev, item])));
                    } else {
                      setError((prev) => {
                        return {
                          ...prev,
                          err: true,
                          msg: `Only ${maxLength} Amenities can be added`,
                        };
                      });
                    }
                  } else {
                    setCurrent((prev) => Array(...new Set([...prev, item])));
                  }
                  setInput('');
                  inpRef.current.focus();
                  setSuggested([]);

                }}
              >
                Add
              </Button>
            </div>
          );
        })}
    </div>
  );
}
