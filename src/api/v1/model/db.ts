import mongoose, { CallbackError, ConnectOptions } from "mongoose";
import log from "../../../logger";

function connect() {
    const uri = 'localhost:27017;
    const options: ConnectOptions = {
        autoIndex: false,
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      };

    return mongoose.connect(uri, options, (err: CallbackError) => {
        if(!err) {
          log.info('Server is connected to mongo'); 
        }
        else {
          log.error('connection error: ' + err);
          process.exit(1);
        }
    });
}

export default connect;
