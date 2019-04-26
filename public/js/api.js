(function(){

    const baseURL = 'http://localhost:3002';
    const jsonMimeType = {
        'Content-type':'application/json'
    };

    function testAPIs(){
        document.getElementById('output').innerHTML = '';
        // list
        callAPI('GET', '/api/conv', {})
            .then((list)=>{
                outputInfo('\n\n***************************\nlist results:');
                outputInfo(JSON.stringify(list));

                // create
                let data = createData('Src');
                callAPI('POST', '/api/conv', {headers: jsonMimeType, body:JSON.stringify(data)})
                    .then((c)=>{
                        let convId = c._id;
                        let newData = c;  // keep a handle to the created c object
                        outputInfo('\n\n***************************\ncreate results:');
                        outputInfo(JSON.stringify(c));

                        // find
                        callAPI('GET','/api/conv/'+convId, null, null)
                            .then((c)=>{
                                outputInfo('\n\n***************************\nfind results:');
                                outputInfo(JSON.stringify(c));

                                // update
                                newData = createData('Tar');
                                newData._id = convId;
                                callAPI('PUT','/api/conv/'+convId, {headers: jsonMimeType,
                                            body:JSON.stringify(newData)})
                                    .then((c)=>{
                                        outputInfo('\n\n***************************\nupdate results:');
                                        outputInfo(JSON.stringify(c));

                                        //delete
                                        callAPI('DELETE', '/api/conv/'+convId, null)
                                            .then((result)=>{
                                                outputInfo('\n\n***************************\ndelete result:');
                                                outputInfo(JSON.stringify(result));
                                            })
                                    });
                            });
                    });
            })
            .catch((err)=>{
                console.error(err);
            });
    }

    async function callAPI(method, uri, params){
        try{
            var response = await fetch(baseURL + uri, {
                method: method, // GET, POST, PUT, DELETE, etc.
                ...params //This spread operator is clever.  Doesn't add an empty object for the GET requests.
            });
            return response.json(); // parses response to JSON
        }catch(err){
            console.error(err);
            return "{'status':'error'}";
        }
    }

    function createData(t){
        // Create an object literal from field values
        const data ={
            sourceAmount: document.getElementById('sourceAmount' + t).value,
            sourceCurrency: document.getElementById('sourceCurrency' + t).value,
            targetCurrency: parseInt(document.getElementById('targetCurrency' + t).value)
        };
        return data;
    }

    function outputInfo(text){
        console.log(text);
        let v = document.getElementById('output').innerHTML;
        v += '<div class="row text-wrap">' + text + '</div>';
        document.getElementById('output').innerHTML = v;
    }

    document.getElementById('testButton').addEventListener("click", ()=>{
        testAPIs();
    });

    window.onload = async function(){
        // Begin with getting the currencies for the selections.
        const c = await callAPI('GET', '/api/conv/currencies');
        populateSelections(c);
    };

    // Use the currencies to create the option values.
    function populateSelections(vals){
        let i = 0;
        let opt;
        let txt;
        for(let v in vals){
            opt = document.createElement("option");
            txt = document.createTextNode(v);
            opt.appendChild(txt);
            opt.setAttribute("value", v);
            document.getElementById('sourceCurrencySrc').appendChild(opt);

            opt = document.createElement("option");
            txt = document.createTextNode(v);
            opt.appendChild(txt);
            opt.setAttribute("value", v);
            document.getElementById('sourceCurrencyTar').appendChild(opt);

            opt = document.createElement("option");
            txt = document.createTextNode(v);
            opt.appendChild(txt);
            opt.setAttribute("value", i);
            document.getElementById('targetCurrencySrc').appendChild(opt);

            opt = document.createElement("option");
            txt = document.createTextNode(v);
            opt.appendChild(txt);
            opt.setAttribute("value", i);
            document.getElementById('targetCurrencyTar').appendChild(opt);
            i++;
        }
    }

})();
