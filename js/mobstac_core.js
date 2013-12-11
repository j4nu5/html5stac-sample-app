/**
 * # mobstac.core.js
 * @author MobStac mobstac-dev-discuss@googlegroups.com
 * @version 0.1
 */


/**
 * The MobStac namespace which contains different utilities, models and collections required for it to function.
 * @namespace
 * @property {object} Config                - Defines Configuration parameters for your MobStac Account. The default values are to connect to MobStac's Demo App. You should override these values to use MobStac backend for your app.
 * @property {number} Config.AccountId      - AccountId for your MobStac Account to fetch dynamic content.
 * @property {number} Config.PropertyId     - PropertyId for your MobStac Property to fetch dynamic content.
 * @property {number} Config.AppId          - AppId for your MobStac App to fetch dynamic content.
 * @property {string} Config.ApiToken       - Authentication Token to connect to MobStac API.
 * @property {string} Config.Environment    - Environment to connect to in the backend. Possible values are: 'qa' and 'prod'. Default is 'qa'.
 */
var MobStac = {
    /**
     * Method for use by Handlebar as a mixin to render image tags for different device width/height.
     *
     * @private
     * @param {string} src source URL for the image to show
     * @param {number} width available width for the image on device
     * @param {number} height available height for the image on device
     * @param {string} altText alternate text for the image tag
     */
    msImg: function(src, width, height, altText) {
        var obj = {
            "src" : Handlebars.Utils.escapeExpression(src),
            "width" : Handlebars.Utils.escapeExpression(width),
            "height" : Handlebars.Utils.escapeExpression(height),
            "altText" : Handlebars.Utils.escapeExpression(altText)
        };
        return new Handlebars.SafeString(MobStac.Utils.scaleImage(obj));
    },
    /**
     * Method for use by Handlebar as a mixin to render image tags for different device width/height.
     *
     * @private
     * @param {string} src source URL for the image to show
     * @param {number} width available width for the image on device
     * @param {number} height available height for the image on device
     * @param {string} altText alternate text for the image tag
     */
    msVid: function(src, provider, width, height) {
        var obj = {
            "src" : Handlebars.Utils.escapeExpression(src),
            "width" : Handlebars.Utils.escapeExpression(width),
            "height" : Handlebars.Utils.escapeExpression(height),
        };
        return new Handlebars.SafeString(MobStac.Utils.scaleVideo(obj, provider));
    }
};

    
MobStac.Config= {
    AccountId: 1,
    PropertyId: 1,
    AppId: 1,
    ApiToken: 'c60834609e506f32760ae0f68f962e393ea5d880',
    Environment: 'QA'
};


/**
 * MobStac User holds the information of a single user in itself. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.User
 */
MobStac.User = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.User
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.User
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/users/";
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.User
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac AccountProfile holds the meta information relating the user to an account. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.AccountProfile
 */
MobStac.AccountProfile = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.AccountProfile
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.AccountProfile
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + '/profiles/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.AccountProfile
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac PropertyProfile holds the meta information linking a user to a property. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.PropertyProfile
 */
MobStac.PropertyProfile = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.PropertyProfile
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.PropertyProfile
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/profiles/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.PropertyProfile
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac Account represents an account in the system. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.Account
 */
MobStac.Account = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.Account
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.Account
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/";
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.Account
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac Property represents a property in the system. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.Property
 */
MobStac.Property = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.Property
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.Property
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/";
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.Property
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac DataFile handles file uploads. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.DataFile
 */
MobStac.DataFile = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.DataFile
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.DataFile
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/datafiles/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.DataFile
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac Feed holds the information of a feed (data source) in the system. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.Feed
 */
MobStac.Feed = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.Feed
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.Feed
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/feeds/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.Feed
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac App holds the information of an app. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.App
 */
MobStac.App = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.App
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.App
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/apps/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.App
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac AccountPermissions holds the permission information for an account. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.AccountPermissions
 */
MobStac.AccountPermissions = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.AccountPermissions
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.AccountPermissions
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/permissions/";
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.AccountPermissions
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac PropertyPermissions holds the permission information for a property. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.PropertyPermissions
 */
MobStac.PropertyPermissions = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.PropertyPermissions
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.PropertyPermissions
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/permissions/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.PropertyPermissions
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac AppPermissions holds the permission information for an app. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.AppPermissions
 */
MobStac.AppPermissions = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.AppPermissions
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.AppPermissions
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + "/apps/" + MobStac.Config.AppId + '/permissions/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.AppPermissions
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac Tag holds the information for a Tag. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * @kind class
 * @name MobStac.Tag
 */
MobStac.Tag = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.Tag
     * @instance
     */
    url: function() {
        return this.urlRoot() + (this.id ? (this.id + "/") : "");
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.Tag
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/tags/';
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.Tag
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});


/**
 * MobStac ContentItem holds the information of a single content item in itself. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * {@link MobStac.ContentItems} is the {@link http://backbonejs.org/#Collection|Backbone Collection} to access a collection containing this object.
 * @kind class
 * @name MobStac.ContentItem
 */
MobStac.ContentItem = Backbone.Model.extend({
    /**
     * Overridden url method to customize requests sent as well as to allow search.
     * @private
     * @method
     * @name url
     * @memberOf MobStac.ContentItem
     * @instance
     */
    url: function() {
        if ( this.contentUrl !== undefined )
        {
            return this.urlRoot() + "?url=" + encodeURIComponent(this.contentUrl);
        }
        // URLs without trailing slashes send HTTP 301 in Django
        var origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    },
    
    /**
     * Overridden urlRoot method to point to MobStac API.
     * @method
     * @private
     * @name urlRoot
     * @memberOf MobStac.ContentItem
     * @instance
     */
    urlRoot: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/contentitems/';
    },
    
    /**
     * Allows search for a ContentItem using the API. This is an asynchronous call and will result in a {@link http://backbonejs.org/#Events-catalog|Model Change Event} if successful.
     * @example
     * //Create a ContentItem object.
     * var contentItem = new MobStac.ContentItem;
     * 
     * //Listen for fetch calls on ContentItem object using a Backbone view. Search will make a call to backend and is an asynchron
     * contentView.listenTo(contentItem, 'fetch', contentView.render);
     *
     * //Make a call to search. 
     * contentItem.search(url)
     * @param {string} url URL to search for in the backend.
     * @name search
     * @method
     * @memberOf MobStac.ContentItem
     * @instance
     */
    search: function(url) {
        this.contentUrl = url;
        this.fetch();
    },
    
    parseRegEx: /{%(.*?)%}/g,

    /**
     * Overridden parse method to customize parse based on API response format.
     * @private
     * @method
     * @param {object} response Response object received from the backend.
     * @param {object} options  Options object passed to Backbone while calling fetch on the object.
     * @returns {object} Parsed response object to be dumped as model attributes.
     * @name parse
     * @memberOf MobStac.ContentItem
     * @instance
     */
    parse: function(response, options) {
        var parsedResult;
        if (this.contentUrl) {
            if (response.results.length > 0) {
                 parsedResult = response.results[0];
            }
        }
        else {
            parsedResult = response;
        }
        if (parsedResult.body !== undefined && parsedResult.body.full !== undefined) {
            parsedResult.body.full = Handlebars.compile(parsedResult.body.full.replace(this.parseRegEx, "{{$1}}"))({ "msstags": undefined });
        }
        return parsedResult;
    },

    /**
     * Overridden fetch method to add custom headers and modify request parameters for MobStac API.
     * @param {object} options Options object for Backbone's call to fetch.
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.ContentItem
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {};
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Model.prototype.fetch.call(this, options);
    }
});
    
/**
 * MobStac Collection holds the information of a single collection in itself. This is an extension of {@link http://backbonejs.org/#Model|BackBone Model} configured to use MobStac Backend.
 * {@link MobStac.collections} is the {@link http://backbonejs.org/#Collection|Backbone Collection} to access a collection containing this object.
 * @kind class
 * @name MobStac.Collection
 */
MobStac.Collection = Backbone.Model.extend({
    /**
     * Overridden method to customize url to communicate with MobStac API.
     *     
     * @private
     * @method
     * @name url
     * @memberOf MobStac.Collection
     * @instance
     */    
    url: function() {
        var origUrl = Backbone.Model.prototype.url.call(this);
        return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
    },

    /**
     * Overridden method to parse response coming from MobStac API.
     *     
     * @private
     * @method
     * @name parse
     * @memberOf MobStac.Collection
     * @instance
     */
    parse: function(response, options) {
        return response;
    },

    /**
     * Points to the {@link MobStac.ContentItems} object that contains different Content Items associated with a {@link MobStac.Collection} instance.
     * 
     * @member
     * @name contentItems
     * @memberOf MobStac.Collection
     * @instance
     */    
    contentItems: undefined,

    /**
     * Triggers a sync with API to get Content Items associated with this object. The content items returned from API can be accessed using {@link contentItems}.
     *
     * @method
     * @name fetchContentItems
     * @memberOf MobStac.Collection
     * @instance
     */
    fetchContentItems: function(options) {
        if (this.contentItems === undefined) {
            this.contentItems = new MobStac.ContentItems({
                contentCollectionId: this.id
            });
        }
        this.contentItems.fetch(options);
    },

    /**
     * Triggers a sync with API.
     *
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.Collection
     * @instance
     */
    fetch: function(options) {
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };

        return Backbone.Model.prototype.fetch.call(this, options);
    }
});

/**
 * {@link http://backbonejs.org/#Collection|Backbone Collection} object to access all the {@link MobStac.Collection} objects available for the app in MobStac API.
 *
 * @name MobStac.collections
 * @static
 */
MobStac.collections = new (Backbone.Collection.extend({

    /**
     * Overridden method to communicate with MobStac API.
     * @method
     * @name url
     * @memberof MobStac.collections
     */
    url: function() {
        return "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + "/apps/" + MobStac.Config.AppId + "/collections/";
    },

    /**
     * Defined model used as {@link MobStac.Collection}.
     *
     * @property class
     * @name model
     * @memberof MobStac.collections
     */
    model: MobStac.Collection,

    /**
     * Overridden method to parse MobStac API response.
     * @method
     * @name parse
     * @memberof MobStac.collections
     */
    parse: function(response, options) {
        return response.results;
    },

    /**
     * Overridden method to communicate with MobStac API.
     * @method
     * @name fetch
     * @memberof MobStac.collections
     */
    fetch: function(options) {
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        return Backbone.Collection.prototype.fetch.call(this, options);
    },
}))();

/**
 * Provides a {@link http://backbonejs.org/#Collection|Backbone Collection} for {@link MobStac.ContentItem} model.
 *
 * @name MobStac.ContentItems
 * @kind class
 */
MobStac.ContentItems = Backbone.Collection.extend({
    /**
     * Defines model to be used as {@link MobStac.ContentItem}
     *
     * @private
     * @memberof MobStac.ContentItems
     * @name model
     * @instance
     */
    model: MobStac.ContentItem,

    /**
     * Overridden method to customize url to communicate with MobStac API.
     *     
     * @private
     * @method
     * @name url
     * @memberOf MobStac.ContentItems
     * @instance
     */    
    url: function() {
        var url = "https://apiv2." + ((MobStac.Config.Environment == "prod")? "" : "qa.") + "mobstac.com/api/2.0/accounts/" + MobStac.Config.AccountId + "/properties/" + MobStac.Config.PropertyId + '/apps/' + MobStac.Config.AppId + '/collections/' + this.contentCollectionId + '/contentitems/';
        return url;
    },

    /**
     * Initializes a collection with options passed to it.
     * @constructs MobStac.ContentItems
     * @param {object} options An object that requires contentCollectionId attribute to associate to a {@link MobStac.Collection} object.
     */
    initialize: function(options) {
        this.contentCollectionId = options.contentCollectionId;
    },

    /**
     * Triggers a sync with API.
     *
     * @private
     * @method
     * @name fetch
     * @memberOf MobStac.ContentItems
     * @instance
     */
    fetch: function(options) {
        if (options === undefined) {
            options = {}
        }
        options['headers'] = {
            'Authorization': 'Token ' + MobStac.Config.ApiToken
        };
        options['remove'] = false;
        return Backbone.Collection.prototype.fetch.call(this, options);
    },

    /**
     * Overridden method to parse response coming from MobStac API.
     *     
     * @private
     * @method
     * @name parse
     * @memberOf MobStac.ContentItems
     * @instance
     */
    parse: function(response, options) {
        return response.results;
    }
});

/**
 * Adds authentication header to XMLHTTPRequest object with {@link MobStac.Config.ApiToken}
 *
 * @method
 * @name MobStac.sendAuthenticationHeader
 * @param {XMLHttpRequest} xhr XMLHTTPRequest object on which Authorization header will be added.
 */
MobStac.sendAuthenticationHeader = function (xhr) {
    xhr.setRequestHeader('Authorization', 'Token ' + MobStac.Config.MAPI_TOKEN);
},

/**
 * Initializes MobStac objects and starts URL routing using {@link http://backbonejs.org/#Router}
 *
 * @name init
 * @method
 * @global
 */
MobStac.init = function() {
    MobStac.collections.fetch({
        success: function() {
            if (window.location.hostname === "localhost") {
                MobStac.Utils.Home = window.location.path;
            }
            else {
                MobStac.Utils.Home = "/";
            }
            Backbone.history.start({
                pushState: true,
                root: '/'
            });
        }
    });
};

/**
 * Namespace that holds different Utility methods provided by MobStac
 * @namespace
 * @name MobStac.Utils
 */
MobStac.Utils = {

    /**
     * Encodes data object and returns a URI encoded representation.
     *
     * @private
     * @method
     * @name encodeData
     * @param {object} data Data string to encode
     * @returns {string} URI encoded representation of data parameters passed
     */
    encodeData : function(data) {
        return Object.keys(data).map(function(key) {
            return [key, data[key]].map(encodeURIComponent).join("=");
        }).join("&");
    },

    /**
     * Generates a CDN URL for the given image URL.
     *
     * @private
     * @method
     * @name getCDNUrl
     * @param {string} imgUrl image URL to CDNize
     * @param {number} width width for the image expected from CDN, use 'origWidth' to avoid resizing
     */
    getCDNUrl : function(imgUrl, width) {
        if (imgUrl && width) {
            return "http://cdn.mobstac.com/m/img/?" + MobStac.Utils.encodeData({ "src" : imgUrl, "w" : width });
        }
    },

    /**
     * scale images to this ratio unless specified
     */
    scalingFactor : 1,

    /**
     * Decides the output media size
     */
    scaleMedia : function(obj, targetWidth) {
        /* 
        obj format:
        {
            "src" : '{{ obj.src }}',
            "width" : {{ obj.width }},
            "height" : {{ obj.height }},
            "altText" : '{{ obj.altText }}',
        } 
        targetWidth is width in px of target obj.
        */
        var scaleTo = parseInt(targetWidth) ? targetWidth : (MobStac.Utils.scalingFactor * obj.width);
        var width = (obj.width > scaleTo) ? scaleTo : obj.width;
        var height = (obj.width == width) ? obj.height : (obj.height*width/obj.width);
        return {
            "width" : width,
            "height" : height,
            "alt" : obj.altText,
            "src" : obj.src
        };
    },

    /**
     * Take an Image json object and return scaled image tag
     */
    scaleImage : function(obj, targetWidth) {
        var o = MobStac.Utils.scaleMedia(obj, targetWidth);
        return '<img class="img-thumbnail" src="' + MobStac.Utils.getCDNUrl(o.src, o.width) + '" width="' + o.width + '" height="' + o.height + '" alt="' + o.alt + '"/>';
    },

    /**
     * return scaled video props
     */
    scaleVideo : function(obj, provider, targetWidth) {
        var o = MobStac.Utils.scaleMedia(obj, targetWidth);
        return MobStac.Utils.generateVideoPlayer(o.src, provider, o.width, o.height);
    },

    /**
     * Takes the video URL & provider and returns the player markup
     */
    generateVideoPlayer : function(origUrl, provider, width, height) {
        if (provider == "youtube") {
            var pattern = /(embed|v)\/([^\?\/]*)/
            var clipid = pattern.exec(origUrl)[2];
            var videourl = 'http://youtube.com/watch?v=' + clipid + '&hl=en_US&feature=player_embedded&version=3';
            return '<iframe src="http://www.youtube.com/embed/' + clipid + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        }
        else if (provider == "vimeo") {
            var vidUrl = origUrl.split('?')[0];
            return '<iframe src="' + vidUrl + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        }
        return '<iframe src="' + origUrl + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
    },

    /**
     * Returns the current orientation of the device
     */
    getOrientation : function() {
        if (window.orientation == 90 || window.orientation == -90) {
            return 'landscape';
        }
        return 'portrait';
    },

    /**
     * Returns the dpi string for use with template matching.
     */
    getDpi : function() {
        if ( window.devicePixelRatio < 1.0 ) {
            return 'ldpi';
        }
        else if ( window.devicePixelRatio < 1.5 ) {
            return 'mdpi';
        }
        else if ( window.devicePixelRatio < 2.0 ) {
            return 'hdpi';
        }
        else if ( window.devicePixelRatio < 3.0 ) {
            return 'xhdpi';
        }
        else {
            return 'xxhdpi';
        }
    },

    getWidth: function() {
        if ( $(window).width() >= 1200 ) {
            return "wlarge";
        }
        else if ( $(window).width() >= 992 ) {
            return "wmedium";
        }
        else if ( $(window).width() >= 768 ) {
            return "wsmall";
        }
        else {
            return "wxsmall";
        }
    },

    /**
     * Loads a template and makes that available for use with Handlebars. The template loaded is the best match for the device on which the webpage is being rendered.
     * To get the template, use {@link MobStac.Utils.getTemplate}
     *
     * @example
     * //Load the template from backend, this should be done during initialization so a template is ready by the time it is needed.
     * MobStac.Utils.loadTemplate("content");
     *
     * //Use Handlebars to compile the template
     * Handlebars.compile(MobStac.Utils.getTemplate());
     *
     * @param {string} name template name to be loaded
     * @method
     * @name MobStac.Utils.loadTemplate
     */
    loadTemplate : function(name) {
        var templateQueryParams = {
            dpi: MobStac.Utils.getDpi(),
            width: MobStac.Utils.getWidth()
        };
        var url;
        if (window.location.hostname !== "localhost") {
            url = "/get-template/" + name + ".html?" + $.param(templateQueryParams);
        }
        else {
            url = "../templates-" + MobStac.Utils.getDpi() + "/" + name + ".html";
        }
        $.ajax(url, {
            success: function(data, textStatus, jqXHR) {
                $('body').append("<script type=\"text/x-handlebars-template\" id=\"" + name + "-template\">" + data + "</script>");
            },
            error: function(jqXHR, textStatus, stringThrown) {
                if (window.location.hostname === "localhost") {
                    url = "../templates/" + name + ".html";
                    $.ajax(url, {
                        success: function(data, textStatus, jqXHR) {
                            $('body').append("<script type=\"text/x-handlebars-template\" id=\"" + name + "-template\">" + data + "</script>");
                        }
                    });
                }
            }
        });
    },

    /**
     * Returns a template that was loaded using {@link MobStac.Utils.loadTemplate}.
     * 
     * @param {string} name template name, this should be the same string as was used to download the template.
     * @method
     * @name MobStac.Utils.getTemplate
     */
    getTemplate : function(name) {
        return $("#" + name + "-template").html();
    },

    /**
     * Decodes the url and returns a parameter's value.
     *
     * @param {string} name parameter name to read from the URL
     * @param {string} url URL to read the parameter value from
     * @method
     * @name MobStac.Utils.getURLParameter
     */
    getURLParameter: function(name, url) {
        if (url === undefined) {
            url = location.search;
        }
        var value = (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
        if (value === null) {
            return value;
        }
        return decodeURI( value );
    }
};

/**
 * Provides a class to handle CSS3 transitions. This won't have any effect in a browser that doesn't support CSS transitions.
 *
 * @class
 * @name MobStac.Slider
 * @param {HTMLElement} element HTML Element to apply transitions.
 */
MobStac.Slider = function(element) {
    var curScale = 1.0
   	var curX = 0;
   	var curY = 0;
   	var self = this;
   	
   	this.getX = function() {
   		return curX;
   	}
   	
   	this.getY = function() {
   		return curY;
   	}
   	
   	function setTransitionProperties(callback, timeout) {
   		if (timeout == undefined)
   			timeout = 0;
   		$(element).css('-webkit-transition', '-webkit-transform ' + timeout + 's ease-in-out');
   		$(element).css('-moz-transition', '-moz-transform ' + timeout + 's ease-in-out');
   		$(element).css('transition', 'transform ' + timeout + 's ease-in-out');
   		var eventHandler = function() {
       		$(element)[0].removeEventListener("webkitTransitionEnd", eventHandler);
       		$(element)[0].removeEventListener("transitionend", eventHandler);
       		$(element).css('-webkit-transition', '');
       		$(element).css('-moz-transition', '');
       		$(element).css('transition', '');
       		if (curX == 0 && curY == 0 && curScale == 1.0) {
       			$(element).css('-webkit-transform', '');
       			$(element).css('-moz-transform', '');
       			$(element).css('transform', '');
       		}
       		if(callback)
       			callback();
       	}
   		if ($(element)[0]) {
   		    $(element)[0].addEventListener("webkitTransitionEnd", eventHandler);
   		    $(element)[0].addEventListener("transitionend", eventHandler);
   		}
   	}
   	
   	function transform() {
   		$(element).css({
   			'-webkit-transform': 'translate3d(' + curX + 'px, ' + curY + 'px, 0px) scale(' + curScale + ')'
   		});
   		$(element).css({
   			'-moz-transform': 'translateX(' + curX + 'px) translateY(' + curY + 'px) scale(' + curScale + ')'
   		});
   		$(element).css({
   			'transform': 'translateX(' + curX + 'px) translateY(' + curY + 'px) scale(' + curScale + ')'
   		});
   	}
   	
    /**
     * Applies a scaling transform to the HTML Element with the provided ratio.
     *
     * @method
     * @name scaleTo
     * @instance
     * @memberof MobStac.Slider
     * @param {float} ratio the ratio to scale the element to
     */
   	this.scaleTo = function(ratio) {
   		curScale = ratio;
   		transform();
   	}
   	
    /**
     * Applies a scaling transform to the HTML Element with the provided ratio with animation.
     *
     * @method
     * @name scaleTransformTo
     * @instance
     * @memberof MobStac.Slider
     * @param {float} ratio the ratio to scale the element to
     * @param {float} timeout time in seconds for the animation to play.
     * @param {SliderslideCallbackslideCallback} callback to be called once the animation stops.
     */
   	this.scaleTransformTo = function(ratio, timeout, callback) {
   		if (!timeout)
   			timeout = 0.5;
   		setTransitionProperties(callback, timeout);
   		curScale = ratio;
   		transform();
   	}
   	
    /**
     * Applies a sliding transition to the HTML Element to the provided x and y coordinates with animation.
     *
     * @method
     * @name slideTo
     * @instance
     * @memberof MobStac.Slider
     * @param {number} x movement along x-axis
     * @param {number} y movement along y-axis
     * @param {float} timeout time in seconds for the animation to play.
     * @param {SliderslideCallbackslideCallback} callback to be called once the animation stops.
     */
   	this.slideTo = function(x, y, timeout, callback) {
   		if ( x != curX || y != curY) {
   			if (!timeout)
   				timeout = 0.25
   				setTransitionProperties(callback, timeout);
   			self.moveTo(x, y);
   		}
   		else {
   			if (callback)
   				callback();
   		}
   	}
   	
    /**
     * Applies a sliding transition to the HTML Element moving by provided x and y distance with animation.
     *
     * @method
     * @name slideBy
     * @instance
     * @memberof MobStac.Slider
     * @param {number} x movement along x-axis
     * @param {number} y movement along y-axis
     * @param {float} timeout time in seconds for the animation to play.
     * @param {SliderslideCallbackslideCallback} callback to be called once the animation stops.
     */
   	this.slideBy = function(x, y, timeout, callback) {
   		if (!timeout)
   			timeout = 0.25
   		setTransitionProperties(callback, timeout);
   		self.moveBy(x, y);
   	}
   	
    /**
     * Moves the HTML Element to the provided x and y coordinates.
     *
     * @method
     * @name moveTo
     * @instance
     * @memberof MobStac.Slider
     * @param {number} x movement along x-axis
     * @param {number} y movement along y-axis
     */
   	this.moveTo = function(x, y) {
   		curX = x;
   		curY = y;
   		transform();
   	}
   	
    /**
     * Moves the HTML Element by the provided x and y distance.
     *
     * @method
     * @name moveBy
     * @instance
     * @memberof MobStac.Slider
     * @param {number} x movement along x-axis
     * @param {number} y movement along y-axis
     */
   	this.moveBy = function(x, y) {
   		curX = x + curX;
   		curY = y + curY;
   		transform();
   	}

    /**
     * The callback associated with animated transitions to signify end of animation.
     *
     * @callback Slider~slideCallback
     */
};

Handlebars.registerHelper('mcfullimg', MobStac.msImg);
Handlebars.registerHelper('mcimg', MobStac.msImg);
Handlebars.registerHelper('mcvideo', MobStac.msVid);
Handlebars.registerHelper('load', function() {
    return '';
});
