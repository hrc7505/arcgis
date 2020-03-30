import { loadModules } from "esri-loader";

export default class ArcGISUtility {
    static USER_NAME;
    static ROOT_URL = "https://www.arcgis.com/sharing/rest";
    static PORTALS_URL = ArcGISUtility.ROOT_URL + "/portals";
    static DEFAULT_EXTENT;
    // Organization id
    static PORTAL_URL;
    static SERVICE_URL = "https://services8.arcgis.com/Toh396wAlwHzzMFm/arcgis/rest/services/service_4/FeatureServer";
    static TOKEN = "OZL5YuUUwOPCX9o6gRkr0b9sVS9ABhdcY2vwSr4vhtmjd-8gioMoxSq7uGLD1cdACywlbHvJVn2YSaOvDurGukLqU5gea2jhNXSplzRsUT7o6tm3asl_D1zUIok6O6tC2gWJyUbfyuMeKnsw4ts-X_wHvZnCqQjOPLnRov01JFzOX6DIXgNzpS0d3EetpGI4-C7nl80wDmU9vNqQTdejGsxDwyS8UBEnrSTnSHujlc4.";
    static COMMON_PARAMS = "f=json&token=" + ArcGISUtility.TOKEN;

    static getUserContentUrl() {
        return this.ROOT_URL + "/content/users/" + this.USER_NAME;
    }

    static async getPortalData() {
        try {
            const response = await fetch(this.PORTALS_URL + "/self?" + this.COMMON_PARAMS);
            const result = await response.json();
            this.PORTAL_URL = this.PORTALS_URL + "/" + result.id;
            this.USER_NAME = result.name;
            this.DEFAULT_EXTENT = result.defaultExtent;
        } catch (error) {
            console.log(error);
        }
    }
    static async getLayers() {
        try {
            const query = this.COMMON_PARAMS + '&q=owner:' + this.USER_NAME + ' AND (type:"Feature Service")&start=1&num=20&sortField=modified&sortOrder=desc';
            const response = await fetch(this.ROOT_URL + "/search?" + query);
            return await response.json();
        } catch (error) {
            console.log("getLayers:", error);
        }
    }

    static async getTags() {
        try {
            const response = await fetch(this.ROOT_URL + "/community/users/" + this.USER_NAME + "/tags?" + this.COMMON_PARAMS);
            return await response.json();
        } catch (error) {
            console.log("getTags:", error);
        }
    }

    static async getUserDetails() {
        try {
            const response = await fetch(this.ROOT_URL + "/community/users/" + this.USER_NAME + "?" + this.COMMON_PARAMS);
            return await response.json();
        } catch (error) {
            console.log("getUserDetails:", error);
        }
    }

    static async isServiceNameAvailable(name) {
        try {
            if (!this.PORTAL_URL) {
                await this.getPortalData();
                if (!this.PORTAL_URL) {
                    throw (new Error("No portal identity found"));
                }
            } console.log("this.PORTAL_URL", this.PORTAL_URL);

            const query = "?name=" + name + "&type=Feature+Service&" + this.COMMON_PARAMS;
            const response = await fetch(this.PORTAL_URL + "/isServiceNameAvailable" + query);
            const result = await response.json();
            return result.available;
        } catch (error) {
            console.log("isServiceNameAvailable:", error);
        }
    }

    static async createService(tags, serviceName) {
        try {
            //  const editorTrackingInfo = "{enableEditorTracking:false,enableOwnershipAccessControl:false,allowOthersToQuery:true,allowOthersToUpdate:true,allowOthersToDelete:false,allowAnonymousToUpdate:true,allowAnonymousToDelete:true}";
            //   const xssPreventionInfo = "{xssPreventionEnabled: true,xssPreventionRule:'InputOnly',xssInputRule:'rejectInvalid'}";
            //  const initialExtent = JSON.stringify(this.DEFAULT_EXTENT);//"{xmin:68.18645994434114,ymin:6.7542127512573344,xmax:97.41250990931805,ymax:35.50437718021094,spatialReference:{wkid:4326}}"
            const createParameters = JSON.stringify({
                maxRecordCount: 2000,
                supportedQueryFormats: 'JSON',
                capabilities: 'Query',
                description: '',
                allowGeometryUpdates: true,
                hasStaticData: true,
                units: 'esriMeters',
                syncEnabled: false,
                editorTrackingInfo: {
                    enableEditorTracking: false,
                    enableOwnershipAccessControl: false,
                    allowOthersToQuery: true,
                    allowOthersToUpdate: true,
                    allowOthersToDelete: false,
                    allowAnonymousToUpdate: true,
                    allowAnonymousToDelete: true
                },
                xssPreventionInfo: {
                    xssPreventionEnabled: true,
                    xssPreventionRule: 'InputOnly',
                    xssInputRule: 'rejectInvalid'
                },
                initialExtent: this.DEFAULT_EXTENT,
                spatialReference: this.DEFAULT_EXTENT.spatialReference,
                tables: [],
                name: serviceName
            });//"{maxRecordCount:2000,supportedQueryFormats:'JSON',capabilities:'Query',description:'Test description',allowGeometryUpdates:true,hasStaticData:true,units: 'esriMeters',syncEnabled:false,editorTrackingInfo:" + editorTrackingInfo + ",xssPreventionInfo:" + xssPreventionInfo + ",initialExtent:" + initialExtent + ",spatialReference:{wkid:4326},tables:[],name:" + JSON.stringify(this.DEFAULT_EXTENT.spatialReference) + "}";

            const query = this.COMMON_PARAMS +
                "&typeKeywords=ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service" +
                "&outputType=featureService" +
                "&tags=" + tags +
                "&createParameters=" + createParameters;

            const response = await fetch(this.getUserContentUrl() + "/createService?" + query, {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            });

            const result = await response.json();
            console.log(result);

        } catch (error) {
            console.log("createService:", error);
        }
    }

    static async update(binary, tags, typeKeywords, layerId) {
        const query = this.COMMON_PARAMS +
            "&thumbnail=" + binary;
        const formData = new FormData();
        if (binary) {
            formData.append("thumbnail", binary);
        }
        formData.append("f", "json");
        formData.append("token", this.TOKEN);
        formData.append("title", "Service 4");
        formData.append("tags", "Service,Manual,Test");
        formData.append("typeKeywords", "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service,Singlelayer");
        formData.append("id", "3fe204dfad5e4a8b92e100421bf03265");

        const response = await fetch(this.getUserContentUrl() + "/items/3fe204dfad5e4a8b92e100421bf03265/update", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log(result);

    }

    /*  static async addToDefinations(serviceName) {
         try {
             const addToDefination=JSON.stringify({
                 layers: [{
                     f: "json",
                     token: this.TOKEN,
                     name: serviceName,
                     type: 'Feature Layer',
                     displayField: '',
                     description: '',
                     copyrightText: '',
                     defaultVisibility: true,
                     relationships: [],
                     isDataVersioned: false,
                     supportsRollbackOnFailureParameter: true,
                     supportsAdvancedQueries: true,
                     geometryType: 'esriGeometryPoint',
                     minScale: 0,
                     maxScale: 0,
                     allowGeometryUpdates: true,
                     hasAttachments: true,
                     htmlPopupType: 'esriServerHTMLPopupTypeNone',
                     hasM: false,
                     hasZ: false,
                     objectIdField: 'OBJECTID',
                     globalIdField: '',
                     typeIdField: '',
                     supportedQueryFormats: 'JSON',
                     hasStaticData: true,
                     maxRecordCount: 10000,
                     capabilities: 'Query',
                     indexes: [],
                     types: [],
                     adminLayerInfo: {
                         geometryField: {
                             name: 'Shape',
                             srid: 4326
                         }
                     },
                     extent: {
                         xmin: 68.18645994434114,
                         ymin: 6.7542127512573344,
                         xmax: 97.41250990931805,
                         ymax: 35.50437718021094,
                         spatialReference: {
                             wkid: 4326
                         }
                     },
                     drawingInfo: {
                         transparency: 0,
                         labelingInfo: null,
                         renderer: {
                             type: 'simple',
                             symbol: {
                                 color: [20, 158, 206, 130],
                                 size: 18,
                                 angle: 0,
                                 xoffset: 0,
                                 yoffset: 0,
                                 type: 'esriSMS',
                                 style: 'esriSMSCircle',
                                 outline: {
                                     color: [255, 255, 255, 220],
                                     width: 2.25,
                                     type: 'esriSLS',
                                     style: 'esriSLSSolid'
                                 }
                             }
                         }
                     },
                     fields: [
                         {
                             name: 'OBJECTID',
                             type: 'esriFieldTypeOID',
                             alias: 'OBJECTID',
                             sqlType: 'sqlTypeOther',
                             nullable: false,
                             editable: false,
                             domain: null,
                             defaultValue: null
                         },
                         {
                             name: 'name',
                             type: 'esriFieldTypeString',
                             alias: 'name',
                             sqlType: 'sqlTypeNVarchar',
                             nullable: true,
                             editable: true,
                             domain: null,
                             defaultValue: null,
                             length: 256
                         }],
                     templates: [
                         {
                             name: 'NewFeature',
                             description: '',
                             drawingTool: 'esriFeatureEditToolPoint',
                             prototype: {
                                 attributes: { name: null }
                             }
                         }
                     ],
                 }]
             })
             const query = this.COMMON_PARAMS +
             "&addToDefinition={layers:[{adminLayerInfo:" + adminLayerInfo + "," + otherParams + ",extent:" + extent + ",drawingInfo:" + drawingInfo + ",fields:" + fields + ",templates:" + templates + "}]}";
             const response = await fetch(this.SERVICE_URL + "/addToDefinition", {
                 method: "POST",
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                 },
             });
 
             const result = await response.json();
             console.log(result);
         } catch (error) {
             console.log("addToDefinations:", error);
         }
     }
  */
    /*  static async addToDefinations() {
         try {
             const adminLayerInfo = "{geometryField:{name:'Shape',srid:4326}}";
             const otherParams = "name:'manual_map_service',type:'Feature Layer',displayField:'',description:'',copyrightText:'',defaultVisibility:true,relationships:[],isDataVersioned:false,supportsRollbackOnFailureParameter:true,supportsAdvancedQueries:true,geometryType:'esriGeometryPoint',minScale:0,maxScale:0,allowGeometryUpdates:true,hasAttachments:true,htmlPopupType:'esriServerHTMLPopupTypeNone',hasM:false,hasZ:false,objectIdField:'OBJECTID',globalIdField:'',typeIdField:'',supportedQueryFormats:'JSON',hasStaticData:true,maxRecordCount:10000,capabilities:'Query',indexes:[],types:[]";
             const extent = "{xmin:68.18645994434114,ymin:6.7542127512573344,xmax:97.41250990931805,ymax:35.50437718021094,spatialReference:{wkid:4326}}";
             const renderer = "{type:'simple',symbol:{color:[20,158,206,130],size:18,angle:0,xoffset:0,yoffset:0,type:'esriSMS',style:'esriSMSCircle',outline:{color:[255,255,255,220],width:2.25,type:'esriSLS',style:'esriSLSSolid'}}}";
             const drawingInfo = "{transparency:0,labelingInfo:null,renderer:" + renderer + "}";
             const fields = "[{name:'OBJECTID',type:'esriFieldTypeOID',alias:'OBJECTID',sqlType:'sqlTypeOther',nullable:false,editable:false,domain:null,defaultValue:null},{name:'name',type:'esriFieldTypeString',alias:'name',sqlType:'sqlTypeNVarchar',nullable:true,editable:true,domain:null,defaultValue:null,length:256}]";
             const templates = "[{name:'NewFeature',description:'',drawingTool:'esriFeatureEditToolPoint',prototype:{attributes:{name:null}}}]";
             let query = this.COMMON_PARAMS +
                 "&addToDefinition={layers:[{adminLayerInfo:" + adminLayerInfo + "," + otherParams + ",extent:" + extent + ",drawingInfo:" + drawingInfo + ",fields:" + fields + ",templates:" + templates + "}]}";
 
             const response = await fetch(this.SERVICE_URL + "/addToDefinition?" + query, {
                 method: "POST",
             });
 
             const result = await response.json();
             console.log(result);
         } catch (error) {
             console.log("addToDefinations:", error);
         }
     } */

    static async updateData() {
        try {
            const updates = "[{attributes:{OBJECTID:2,name:'Visnagar Railway Station',description:'Showing station of Railway'},geometry:{x:72.54174551907066,y:23.702966533824398}}]";
            const query = this.COMMON_PARAMS +
                "&updates=" + updates;
            const response = await fetch(this.SERVICE_URL + "/0/applyEdits?" + query, {
                method: "POST",
            });
            console.log(await response.json());
        } catch (error) {
            console.log("updateData:", error)
        }
    }

    static async getAccessToken() {
        try {
            const query = "?f=json&username=" + ArcGISUtility.USER_NAME + "&password=Hardik7505";
            const response = await fetch("https://hrc7505.maps.arcgis.com/arcgis/admin/generateToken" + query, {
                method: "post",
                headers: {
                    'Access-Control-Allow-Origin': "*"
                }
            });
            console.log(response);

        } catch (error) {
            console.log("getAccessToken:", error);
        }
    }

    static async showMap() {
        const [Map, MapView, FeatureLayer] = await loadModules(
            ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"],
            { css: true });

        const layer = new FeatureLayer({
            // URL to the service
            url: "https://services7.arcgis.com/5pxw1eo6D2JUnzAN/arcgis/rest/services/hrc_inspections/FeatureServer",
            renderer: {  // overrides the layer's default renderer
                type: "simple",
                symbol: {
                    type: "text",
                    color: "red",
                    text: "\ue661",
                    font: {
                        size: 20,
                        family: "CalciteWebCoreIcons"
                    }
                }
            },
            popupTemplate: {
                // autocasts as new PopupTemplate()
                title: "{Name}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "Name"
                            },
                            {
                                fieldName: "description"
                            },
                        ]
                    }
                ]
            }
        });

        const map = new Map({
            basemap: 'topo-vector'
        });
        map.add(layer);

        // load the map view at the ref's DOM node
        const view = new MapView({
            container: "z",//document.getElementById("z"),
            map: map,
            center: [72.5420, 23.7026],
            zoom: 8
        });

        view.on("mouse-wheel", () => {
            // Get map extent
            console.log("data", view.extent);
        })

    }

    static async showExtentSelector() {
        const [Map, MapView] = await loadModules(["esri/Map", "esri/views/MapView"]);

        const map = new Map({
            basemap: 'topo-vector'
        });

        // load the map view at the ref's DOM node
        const view = new MapView({
            container: "zextentSelector",
            map: map,
            center: [72.5420, 23.7026],
            zoom: 8
        });

        view.on("mouse-wheel", () => {
            // Get map extent
            console.log("data", view.extent);
        })

    }

    static async user() {
        try {
            const data = {
                invitations: [{
                    email: "hrc7505@gmail.com",
                    firstname: "Hardik",
                    lastname: "Chaudhari",
                    username: "hardik7505",
                    role: "iAAAAAAAAAAAAAAA",
                    userLicenseType: "viewerUT",
                    fullname: "Hardik Chaudhari",
                    userType: "arcgisonly",
                    groups: "",
                    userCreditAssignment: -1,
                    applyActUserDefaults: false
                }]
            };
            const formData = new FormData();
            formData.append("invitationList", JSON.stringify(data));
            formData.append("f", "json");
            formData.append("token", "DcYoUewF13_18MwgaDEpreRqZNVnIJp018K1DIjS3bpQdmk1XRwQhE5dQHaw0gXX4p_zw7Bz2xo3zDYjw94XqwhC5cM0nRjEkx_Vv01lfOJdi2HaV_uuzkcZ4413n01ohP8PylW4y7NMmp4Z2FGfW2JX2lajcdzftIWvujWFynK6S1SK518ySapKSVpe9zDOcuqQFrO9QR79eA00C_mF98rWHFNTPvSw1U9Y1K-Fhrk.");

            const response = await fetch("https://hrc7505.maps.arcgis.com/sharing/rest/portals/self/invite", {
                method: "POST",
                body: formData,

            });

            console.log(await response.json());
        } catch (error) {
            console.log("user:", error);
        }
    }
}