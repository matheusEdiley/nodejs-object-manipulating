let express = require('express');
let config = require('config');
let app = express();

app.listen(3000, () => {

    // Get array of objects of configuration file.
    let endPoint = config;

    endPoint.events.forEach(element => {
        //Change the array key-value in oject
        let result = element.custom_data.reduce((r, e) => {
            r[e.key] = e.value;
            return r;
        }, {});

        //Merges the object created above with the main object
        element = Object.assign(element, result);

        console.log(element);
        //deletes unused vector
        delete element.custom_data;
    });

    //Split the array into parts to manipulate it 
    let timeline = Object.values(endPoint.events.reduce((result, {
        transaction_id,
        product_price,
        product_name,
        store_name,
        revenue,
        timestamp
    }) => {
        //Create a new group
        if (!result[transaction_id]) result[transaction_id] = {
            timestamp,
            revenue,
            transaction_id,
            store_name,
            products: []
        };

        //Verify that the object has store_name and revenue
        if (revenue) {
            result[transaction_id].revenue = revenue;
        }
        if (store_name) {
            result[transaction_id].store_name = store_name;
        }

        //Grouping attribute
        result[transaction_id].timestamp = timestamp;

        //Add to product group
        if (product_name && product_price) {
            result[transaction_id].products.push({
                "name": product_name,
                "price": product_price
            });
        }
        return result;
    }, {}));

    //Sorts by date (timestamp) in descending order
    timeline.sort((a, b) => {
        let dateA = new Date(a.timestamp);
        let dateB = new Date(b.timestamp);
        return dateB - dateA;
    });

    //final result
    console.log(timeline);
});
