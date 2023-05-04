const http = require( 'http' );
const Io = require( './utils/Io' );
const path = require( 'path' )
const server = http.createServer( async ( req, res ) => { 
    try {
      const io = new Io(path.join(__dirname, "db", "todos.json"));
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      // get all todos
      if (req.url == "/" && req.method == "GET") {
        return res.end(JSON.stringify(await io.read(), null, 4));
      }
      //get by id
      if (req.url.split("/")[1] && req.method == "GET") {
        const data = await io.read();
        const find = data.find((e) => e.id == req.url.split("/")[1]);
        if (find) {
          return res.end(JSON.stringify(find, null, 4));
        } else {
          throw new Error("Ko`rsatilgan id bo`yicha malumotlar topilmadi");
        }
      }
      // create todo
      if (req.url == "/create" && req.method == "POST") {
        const data = await io.read();
        return req.on("data", (chunk) => {
          const { title, text } = JSON.parse(chunk);
          if ((title, text)) {
            data.push({
              id: data[data.length - 1]?.id + 1 || 1,
              title,
              text,
              iscomplate: "process",
              timestamp: new Date(),
            });
            io.write(data);
            res.end(
              JSON.stringify({
                status: "success",
                message: "Successfully created",
              })
            );
          } else {
            res.writeHead(400, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(
              JSON.stringify(
                {
                  status: 400,
                  message: "title va text majburiy",
                },
                null,
                4
              )
            );
            // throw new Error("title and description required");
          }
        });
      }

      const url = req.url.split("/");
      if (url[1] == "byicomplate" && url[2] && req.method == "PUT") {
        const data = await io.read();
        const find = data.find((e) => e.id == url[2]);
        req.on("data", (chunk) => {
          const { iscomplate } = JSON.parse(chunk);
          if (iscomplate) {
            find.iscomplate = iscomplate;
            io.write(data);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(
              JSON.stringify(
                {
                  status: 200,
                  message: "bajarildi",
                },
                null,
                4
              )
            );
          }
          else {
            res.writeHead(400, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            return res.end(
              JSON.stringify({status: 400, message: "iscomplate not found"}, null, 4
              )
            );
          }
        });
      }

      // edit todo
      if (req.url.split("/")[1] && req.method == "PUT") {
        const data = await io.read();
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        const find = data.find((e) => e.id == req.url.split("/")[1]);
        if (find) {
          return req.on("data", (chunk) => {
            const { title, text } = JSON.parse(chunk);
              if ( title && text ) {
                  find.title = title;
                  find.text = text;
                  io.write( data );
                  res.writeHead( 200, {
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin": "*",
                  } );
                res.end(
                      JSON.stringify( {
                          status: 200,
                          message: "Edit qilindi",
                      } )
                  );
              }
              else {
                throw new Error(
                  "url da id mavjud emas yoki body dan malumotlar yubormagansiz yoki bu item mavjud emas"
                );
              }
          });
        } else {
          throw new Error(
            "url da id mavjud emas yoki body dan malumotlar yubormagansiz yoki bu item mavjud emas"
          );
        }
      }
      return res.end("Route mavjud emas ");
    }
    catch ( err ) { 
        res.writeHead( 400, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        } )
        res.end( JSON.stringify( {
            status: 400,
            message: err.message,
        }, null, 4 ))
    }
} )

server.listen( 9000, ( err ) => { 
    if ( err ) {
        return console.log(err.message)
    }
    console.log('server starting on http://localhost:9000')
} )