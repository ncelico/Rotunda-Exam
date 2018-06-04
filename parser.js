/*
    URL Parser Exercise

    We need some logic that extracts the variable parts of a url into a hash. The keys
    of the extract hash will be the "names" of the variable parts of a url, and the
    values of the hash will be the values. We will be supplied with:
    1. A url format string, which describes the format of a url. A url format string
    can contain constant parts and variable parts, in any order, where "parts"
    of a url are separated with "/". All variable parts begin with a colon. Here is
    an example of such a url format string:
    "/:version/api/:collecton/:id"
    2. A particular url instance that is guaranteed to have the format given by
    the url format string. It may also contain url parameters. For example,
    given the example url format string above, the url instance might be:
    "/6/api/listings/3?sort=desc&limit=10"
    Given this example url format string and url instance, the hash we want that
    maps all the variable parts of the url instance to their values would look like this:
    {
    version: 6,
    collection: "listings",
    id: 3,
    sort: "desc",
    limit: 10
    }
    Please implement a solution to this problem in JavaScript with attention to code
    structure and readability. Feel free to use low-level libraries like underscore.
*/

class Parser
{
    constructor(urlformat)
    {
        this.urlFormat = urlformat;
    }

    static formatLeftSide(str)
    {
        //Could also be a regex...
        if (str && str.length > 1 && str[0] === ":") return str.slice(1);
        return str;
    }

    //https://stackoverflow.com/a/9716488/4992092
    static isNumeric(str) 
    {
        return !isNaN(parseFloat(str)) && isFinite(str);
    }

    static formatRightSide(str)
    {
        if (Parser.isNumeric(str))
            return parseFloat(str);

        return str;

        //TODO: Might be improved to also cast to booleans.
    }

    static parseUrlParameters(format, url)
    {
        const parameters = {};

        const multiple = url.split("?");
        //This one will always end up in the object
        parameters[Parser.formatLeftSide(format)] = Parser.formatRightSide(multiple[0]);

        if (multiple.length > 1)
        {
            //Further split the string by '&'
            var pieces = multiple[1].split("&");
            pieces.forEach(element => {
                const terms = element.split("=");
                
                if (terms.length !== 2) 
                    throw new Error("Not in the format 'something=something'");
                
                parameters[Parser.formatLeftSide(terms[0])] = Parser.formatRightSide(terms[1]);
            });
        }

        return parameters;
    }

    getHash(urlInstance) 
    {
        //I know, strange name, but I got used to it over the years :)
        let returning = {};
        
        const formatParts = this.urlFormat.split("/",);
        const urlParts = urlInstance.split("/");

        //Silly quick validation
        if (formatParts.length !== urlParts.length)
            throw new Error("The argument URL does not comply with the provided URL Format");

        //At this point, since we know both arrays are the same size
        //we can just traverse them together.
        //I know, it could have been a forEach() on either array
        //but I thought it was cleaner this way.
        for (let index = 0; index < formatParts.length; index++) 
        {
            const format = formatParts[index];
            const url = urlParts[index];
            
            if (format.length > 0 && format[0] === ":")
            {
                //It's a variable, store it in the hash.
                //Call a static method to parse multi parameter chunks
                const parsed = Parser.parseUrlParameters(format, url);
                //Use object rest spread to merge the existing and returned object
                returning = { ...returning, ...parsed };
            } 
            else
            {
                //Static piece of the URL, validate format
                if (format !== url)
                    throw new Error("The argument URL does not comply with the provided URL Format");
            }
        }

        return returning;
    }
}

const toParse = new Parser("/:version/api/:collecton/:id");
const json = toParse.getHash("/6/api/listings/3?sort=desc&limit=10");

console.log(json);

/*
    THE PARSER HAS SOME QUIRKS.
    IT WILL ALLOW WEIRD URLS LIKE       /6?nico=is&super=awesome/api/listings/3?sort=desc&limit=10
    BUT WILL BREAK WITH STUFF LIKE THIS /6/api/listings/3?sort=desc&limit=10&returnTo=/Home
    AND LOOKING AT IT, THE ONLY NON STATIC METHOD COULD ALSO BE TURNED INTO STATIC
    IF WE JUST ADD AND EXTRA PARAMETER FOR THE URL FORMAT AND REMOVE IT FROM THE CONSTRUCTOR
    BUT THAT IS A MATTER OF TASTE/DESIGN DECISION...
*/