var NavigationView = Backbone.View.extend({
    initialize: function(options) {
        this.listenTo(this.collection, 'fetch', this.render);
    },

    render: function() {
        var template = Handlebars.compile( MobStac.Utils.getTemplate( "navigation" ));
        $(this.el).html( template( this.collection ) );
        return this;
    }
});

var CollectionView = Backbone.View.extend({
    initialize: function(options) {
        this.listenTo(this.collection, 'fetch', this.render);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.position = options.position;
        this.navEl = options.navEl;
        this.relativePosition = options.relativePosition || 0;
    },

    renderNext: function() {
        if (this.position < this.collection.models.length - 1) {
            this.nextView = new CollectionView({
                collection: this.collection,
                position: this.position + 1,
                navEl: this.navEl,
                relativePosition: 1,
                el: $(this.el)
            });
            this.nextView.render();
        }
        else {
            this.nextView = undefined;
        }
    },

    renderPrevious: function() {
        if (this.position > 0) {
            this.prevView = new CollectionView({
                collection: this.collection,
                position: this.position - 1,
                navEl: this.navEl,
                relativePosition: -1,
                el: $(this.el)
            });
            this.prevView.render();
        }
        else {
            this.prevView = undefined;
        }
    },

    swipeNext: function() {
        if (this.nextView !== undefined) {
            this.slider.slideTo(-1 * $(window).width(), 0);
            this.nextView.slider.slideTo( 0, 0 );
            this.relativePosition = -1;
            this.nextView.relativePosition = 0;
            this.movedX = 0;
            this.nextView.renderNext();
            this.nextView.updateNav();
            this.nextView.prevView = this;
            if (this.prevView !== undefined)
                this.prevView.remove();
        }
    },

    swipePrev: function() {
        if (this.prevView !== undefined) {
            this.slider.slideTo( $(window).width(), 0);
            this.prevView.slider.slideTo( 0, 0 );
            this.relativePosition = 1;
            this.prevView.relativePosition = 0;
            this.movedX = 0;
            this.prevView.renderPrevious();
            this.prevView.updateNav();
            this.prevView.nextView = this;
            if (this.nextView !== undefined)
                this.nextView.remove();
        }
    },

    remove: function() {
        $(this.element).remove();
        delete this;
    },

    updateNav: function() {
        $(this.navEl).find('li').removeClass('active');
        $(this.navEl).find('li').filter(':has(a[href="' + this.collection.at(this.position).attributes.url + '"])').addClass('active');
    },

    addTouch: function() {
        if (! $(this.element).data("touchstac")) {
            $(this.element).data("touchstac", true);
            $(this.element).touchstac({
                moveX: 50,
                moveY: 50,
                tapToClick: true,
                context: this,
                wipeMove: function(result, e, context) {
                    if (context.relativePosition != 0)
                        return true;
                    var startX = 0;
                    var curX = 0;
                    var startY = 0;
                    var curY = 0;
                    for (var i=0; i < result.startX.length; i++) {
                        startX += result.startX[i];
                        curX += result.curX[i];
                    }
                    for (var i=0; i < result.startY.length; i++) {
                        startY += result.startY[i];
                        curY += result.curY[i];
                    }
                    startX = Math.floor(startX/result.startX.length);
            	    curX = Math.floor(curX/result.curX.length);
            	    
            	    startY = Math.floor(startY/result.startY.length);
            	    curY = Math.floor(curY/result.curY.length);
            	    
                    var moveToHandleX = curX - startX;

                    if (context.prevView === undefined && moveToHandleX > 0 ) {
                        return false;
                    }

                    if (context.nextView === undefined && moveToHandleX < 0 ) {
                        return false;
                    }

                    if (context.prevView !== undefined ) {
                        context.prevView.slider.moveBy(moveToHandleX - context.movedX, 0);
                    }
                    if ( context.nextView !== undefined ) {
                        context.nextView.slider.moveBy(moveToHandleX - context.movedX, 0);
                    }
                    context.slider.moveBy(moveToHandleX - context.movedX, 0);
                    context.movedX = moveToHandleX;
                    return false;
                },

                wipeMoveCancel: function(result, e, context) {
                    if (context.relativePosition != 0)
                        return true;
                    if (context.prevView.slider !== undefined ) { 
                        context.prevView.slider.moveBy(0 - context.movedX, 0);
                    }
                    if ( context.nextView.slider !== undefined ) {
                        context.nextView.slider.moveBy(0 - context.movedX, 0);
                    }
                    context.slider.moveBy(0 - context.movedX, 0);
                    context.movedX = 0;
                },

                wipeLeft: function(result, e, context) {
                    if (context.relativePosition != 0)
                        return true;
                    context.swipeNext();
                },

                wipeRight: function(result, e, context) {
                    if (context.relativePosition != 0)
                        return true;
                    context.swipePrev();
                }

            });
        }
    },

    render: function() {
        var self = this;
        var attributes = this.collection.at(this.position).attributes;
        if (this.relativePosition == 0)
            $(this.el).html("");
        if (attributes.displayOptions.displayMeta !== undefined) {
            this.template = Handlebars.compile( MobStac.Utils.getTemplate( attributes.displayOptions.template ));
            var html = this.template( attributes );
            $(this.el).append( html );
            for (var index in attributes.displayOptions.displayMeta) {
                var displayMeta = attributes.displayOptions.displayMeta[index];
                this.collection.get(displayMeta.source).fetchContentItems();
                var contentView = new CollectionContentView({
                    el: $(this.el).find("#collection" + displayMeta.source + "-" + displayMeta.limit + "-" + displayMeta.offset),
                    collection: this.collection.get(displayMeta.source).contentItems,
                    template: displayMeta.type,
                    limit: displayMeta.limit,
                    offset: displayMeta.offset
                });
                contentView.render();
            }
        }
        else {
            this.template = Handlebars.compile( MobStac.Utils.getTemplate( "collection" ));
            var html = this.template( attributes );
            $(this.el).append( html );
            this.collection.at(this.position).fetchContentItems();
            if (this.contentView === undefined) {
                this.contentView = new CollectionContentView({
                    el: $(this.el).find("#collection" + this.collection.at(this.position).id),
                    collection: this.collection.at(this.position).contentItems,
                });
            }
            this.contentView.render();
        }
        /*this.element = $(this.el).find("#collection" + this.collection.at(this.position).id);
        this.slider = new MobStac.Slider(this.element);
        if (Modernizr.csstransforms && Modernizr.touch) {
            this.addTouch();
            if (this.relativePosition == -1) {
                this.slider.moveTo( -1*$(window).width(), 0);
            }
            else if (this.relativePosition == 1) {
                this.slider.moveTo( $(window).width(), 0);
            }
        }
        if (this.relativePosition == 0) {
            this.updateNav();
            if (Modernizr.csstransforms && Modernizr.touch) {
                this.renderNext();
                this.renderPrevious();
                
                this.movedX = 0;
            }
            else {
                $(this.el).find(".tab-pane").addClass('active');
            }
        }*/
        return this;
    },
});


var CollectionContentView = Backbone.View.extend({
    initialize: function(options) {
        this.listenTo(this.collection, 'fetch', this.render);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.offset = 1;
        this.limit = 100;
        if (options.limit !== undefined)
            this.limit = options.limit;
        if (options.offset !== undefined) {
            this.offset = options.offset + 1;
        }
        if (options.template !== undefined) {
            this.template = Handlebars.compile( MobStac.Utils.getTemplate(options.template) );
        }
        else {
            this.template = Handlebars.compile( MobStac.Utils.getTemplate("collection-content") );
        }
    },

    render: function() {
        $(this.el).html("");
        for (var i=this.offset; i < this.collection.length && i<this.limit + this.offset; i++) {
            $(this.el).append( this.template( this.collection.at(i).attributes ));
            //this.collection.at(i).fetch();
        }
        return this;
    }
});

var ContentView = Backbone.View.extend({
    initialize: function(options) {
        if (this.collection !== undefined) {
            this.listenTo(this.collection, 'fetch', this.render);
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.position = options.position;
        }
        else {
            this.listenTo(this.model, 'change', this.render);
        }
    },

    render: function() {
        var template = Handlebars.compile( MobStac.Utils.getTemplate("content") );
        if (this.collection !== undefined) {
            $(this.el).html( template( this.collection.at(this.position).attributes ));
        }
        else {
            $(this.el).html( template( this.model.attributes ) );
        }
    }
});

var domainName = "test.mobstacapp.com";

var MobStacRouter = Backbone.Router.extend({
    routes: {
        "*url": "handleURL",
        "static/*path": "handleStatic"
    },
    
    handleURL: function() {
        url = window.location.pathname + window.location.search;
        navigationView.render();
        if (window.location.hostname === "localhost") {
            var name = "url";
            url = MobStac.Utils.getURLParameter(name);
            if (url !== null && url.substr(-1,1) !== "/" && url.indexOf('?') == -1) {
                url = url + "/";
            }
        }
        if ( url == null ) {
            url = ""
        }
        if (url.substr(0,1) !== "/") {
            url = "/" + url;
        }
        var collection = MobStac.collections.findWhere({
            url: url
        });
        if (collection === undefined) {
            for (var index in MobStac.collections.models) {
                var contentItems = MobStac.collections.at(index).contentItems;
                if (contentItems === undefined ) {
                    continue;
                }
                var content = contentItems.findWhere({
                    url: url
                });
                if ( content !== undefined ) {
                    var contentView = new ContentView({
                        el: $("#collections"),
                        collection: contentItems,
                        position: contentItems.indexOf(content)
                    });
                    contentView.render();
                    break;
                }
            }

            var content = new MobStac.ContentItem;
            content.search(url);
            
            var contentView = new ContentView({
                el: $("#collections"),
                model: content
            });
            contentView.render();
        }
        else {
            var collection_view = new CollectionView({
                el: $("#collections"),
                navEl: $("#navigation"),
                collection: MobStac.collections,
                position: MobStac.collections.indexOf(collection)
            });
            collection_view.render();
        }
    },

    handleStatic: function(path) {
        window.location = "/static/" + path;
    }
});

var router = new MobStacRouter();
var navigationView;

$().ready(function() {
    navigationView = new NavigationView({
        el: $("#navigation"),
        collection: MobStac.collections
    });
    MobStac.Config.Environment = "prod";
    MobStac.Config.ApiToken = "ebe3d6abd32493a4a9c49fd2b56c6f13680f0b40";
    MobStac.Utils.loadTemplate("navigation");
    MobStac.Utils.loadTemplate("content");
    MobStac.Utils.loadTemplate("collection");
    MobStac.Utils.loadTemplate("collection-content");
    MobStac.Utils.loadTemplate("collection-primary");
    MobStac.Utils.loadTemplate("collection-secondary");
    MobStac.Utils.loadTemplate("collection-sidebar");
    MobStac.Utils.loadTemplate("collection-home");
    MobStac.Utils.loadTemplate("collection-blog");
    MobStac.Utils.loadTemplate("collection-video");
    MobStac.Utils.loadTemplate("collection-news");
    MobStac.Utils.loadTemplate("collection-videos");
    MobStac.init();
    /*if (Modernizr.touch) {
        $('body').touchstac({
            moveX: 20,
            tapToClick: true,
            wipeLeft: function() {
                return false;
            },
            wipeRight: function() {
                return false;
            }
        });
        $('body').on("tap", "*", function() {
            $(this).trigger("click");
            return false;
        });
    }*/
        $('body').on("click", "a", function() {
            var url = $(this).attr('href');
            if (url) {
                if (url.substr(0,1) == "/") {
                    if (window.location.hostname == "localhost") {
                        router.navigate("?url=" + encodeURIComponent(url.trim()), {
                            trigger: true
                        });
                    }
                    else {
                        router.navigate(url, {
                            trigger: true
                        });
                    }
                    return false;
                }
                else if (url.substr(0,1) != '#'){
                    window.open(url);
                    return false;
                }
            }
        });
});

