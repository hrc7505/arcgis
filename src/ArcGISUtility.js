import { loadModules } from "esri-loader";

export default class ArcGISUtility {
    static ROOT_URL = "https://www.arcgis.com/sharing/rest";
    static PORTALS_URL = ArcGISUtility.ROOT_URL + "/portals";
    static PORTAL_URL = ArcGISUtility.PORTALS_URL + "/5pxw1eo6D2JUnzAN";
    static USER_CONTENT_URL = ArcGISUtility.ROOT_URL + "/content/users/hardik7505";
    static SERVICE_URL = "https://services7.arcgis.com/5pxw1eo6D2JUnzAN/arcgis/rest/services/manual_map_service/FeatureServer";
    static TOKEN = "qlfFFfsUhHGy7IzAuSRwcCE9VVWzPv7uqEjqfQFSRi5yh0yqGukx94XGm9kL1Fzl0CXJRMT8YFALCamnSVo9KiUMl7__rm5fgWr3-MySzYFe92b4kK9QVoZWQ0JewC77jZ8HzhbhcwyOa8tCUSa0KT4gWHuVSH4SUPXqSBjeOZeoETdwhr7e3luUB3oO9Krd5Y3s5S8ZK5H7fXY_SnPtQY1Y8f7z8kIXgKiBVUilotk.";
    static COMMON_PARAMS = "f=json&token=" + ArcGISUtility.TOKEN;

    static async getLayers() {
        try {
            const query = this.COMMON_PARAMS + '&q=owner:hardik7505 AND (type:"Feature Service")&start=1&num=20&sortField=modified&sortOrder=desc';
            const response = await fetch(this.ROOT_URL + "/search?" + query);
            return await response.json();
        } catch (error) {
            console.log("getLayers:", error);
        }
    }

    static async getTags(){
         try {
            const response = await fetch(this.ROOT_URL + "/community/users/hardik7505/tags?" + this.COMMON_PARAMS);
            return await response.json();
        } catch (error) {
            console.log("getTags:", error);
        }
    }

    static async getUserDetails(){
        try {
            const response = await fetch(this.ROOT_URL + "/community/users/hardik7505?" + this.COMMON_PARAMS);
            return await response.json();
        } catch (error) {
            console.log("getUserDetails:", error);
        }
    }

    static async isServiceNameAvailable() {
        try {
            const query = "?name=manual_map_service&type=Feature+Service&" + this.COMMON_PARAMS;
            const response = await fetch(this.PORTAL_URL + "/isServiceNameAvailable" + query);
            const result = await response.json();
            return result.available;
        } catch (error) {
            console.log("isServiceNameAvailable:", error);
        }
    }

    static async createService() {
        if (!(await this.isServiceNameAvailable())) {
            console.log("Service name not available");
            return;
        }
        try {
            const editorTrackingInfo = "{enableEditorTracking:false,enableOwnershipAccessControl:false,allowOthersToQuery:true,allowOthersToUpdate:true,allowOthersToDelete:false,allowAnonymousToUpdate:true,allowAnonymousToDelete:true}";
            const xssPreventionInfo = "{xssPreventionEnabled: true,xssPreventionRule:'InputOnly',xssInputRule:'rejectInvalid'}";
            const initialExtent = "{xmin:68.18645994434114,ymin:6.7542127512573344,xmax:97.41250990931805,ymax:35.50437718021094,spatialReference:{wkid:4326}}"
            const createParameters = "{maxRecordCount:2000,supportedQueryFormats:'JSON',capabilities:'Query',description:'Test description',allowGeometryUpdates:true,hasStaticData:true,units: 'esriMeters',syncEnabled:false,editorTrackingInfo:" + editorTrackingInfo + ",xssPreventionInfo:" + xssPreventionInfo + ",initialExtent:" + initialExtent + ",spatialReference:{wkid:4326},tables:[],name:'manual_map_service'}";

            const query = this.COMMON_PARAMS +
                "&typeKeywords=ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service" +
                "&outputType=featureService" +
                "&tags=service" +
                "&createParameters=" + createParameters;
            const response = await fetch(this.USER_CONTENT_URL + "/createService?" + query, {
                method: "POST",

            });

            const result = await response.json();
            console.log(result);

        } catch (error) {
            console.log("createService:", error);
        }
    }

    static async update() {
        const query = this.COMMON_PARAMS +
            "&thumbnail=null";
        const response = await fetch(this.USER_CONTENT_URL + "/items/02327758bcfc45d0835f4617bd01c30c/update?" + query, {
            method: "POST",
        });

        const result = await response.json();
        console.log(result);

    }

    static async addToDefinations() {
        try {
            const response = await fetch(this.SERVICE_URL + "/addToDefinition", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new FormData({
                    addToDefinition: {
                        layers: [{
                            f: "json",
                            token: this.TOKEN,
                            name: 'manual_map_service',
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
                    }
                })
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log("addToDefinations:", error);
        }
    }

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
            const query = "?f=json&username=hardik7505&password=Hardik@7505";
            const response = await fetch("https://wecreate.maps.arcgis.com/arcgis/admin/generateToken" + query, {
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
    }
}