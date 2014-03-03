package tud.geometafacet.helper;
/**
 * Constants used in the project GeoMetaFacet
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class Constants { 
	
	// -----------------------------------------------------------------------------------------
	// -- common endpoints to CSW and DB -------------------------------------------------------
	// db request needed for pre-processing, lineage 
	// in tud.metaviz.connection, tud.geometafacet.controlling
	// -----------------------------------------------------------------------------------------

	public static final String cswURL = "";
	public static final String dbEndpoint = "";
	public static final String jdbcURL = "";
	public static final String dbUser = "";
	public static final String dbPasswd = "";
 
	// -----------------------------------------------------------------------------------------	
	// -- DB Request for getting distributed catalogue data (pre-processed) xPath --------------
	// in tud.gemeometafacet.controlling
	// -----------------------------------------------------------------------------------------

	public static final String xPathTopicShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:topicCategory/gmd:MD_TopicCategoryCode";
	
	//short ones! gmd:metadata missing 
	public static final String xPathPartServices = "gmd:identificationInfo/srv:SV_ServiceIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";
	public static final String xPathOrganisationShort2 = "gmd:distributionInfo/gmd:MD_Distribution/gmd:distributor/gmd:MD_Distributor/gmd:distributorContact/gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString/text()";	
	public static final String xPathServiceAbstractShort = "gmd:identificationInfo/srv:SV_ServiceIdentification/gmd:abstract/gco:CharacterString/text()";

	//extent short
	public static final String xPathTimeBeginShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:beginPosition/text()";
	public static final String xPathTimeEndShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:endPosition/text()";
	public static final String xPathExtentWestShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:westBoundLongitude/gco:Decimal/text()";
	public static final String xPathExtentEastShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:eastBoundLongitude/gco:Decimal/text()";
	public static final String xPathExtentSouthShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:southBoundLatitude/gco:Decimal/text()";
	public static final String xPathExtentNorthShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:northBoundLatitude/gco:Decimal/text()";
	
	public static final String xPathCoupledResource = "//gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification/srv:coupledResource/srv:SV_CoupledResource";
	public static final String xPathCoupledResourceIdentifier = "srv:identifier/gco:CharacterString/text()";
	public static final String xPathCoupledResourceScopedName = "gco:ScopedName/text()"; 
 
	//distributed catalogs
	public static final String xPathCatalogURL = "//gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification/srv:containsOperations/srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource/gmd:linkage/gmd:URL/text()";

	// -----------------------------------------------------------------------------------------
	// -- METAVIZ -- LINEAGE --- xPath ---------------------------------------------------------
	// in tud.metaviz
	// -----------------------------------------------------------------------------------------		
	
	public static final String xPathEntries = "//gmd:MD_Metadata";
	public static final String xPathIdentifier = "//gmd:MD_Metadata/gmd:fileIdentifier/gco:CharacterString/text()";
	public static final String xPathDataSets = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";
	public static final String xPathDataSetAbstract = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:abstract/gco:CharacterString/text()";	
	public static final String xPathRSIdentifier = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:RS_Identifier/gmd:code/gco:CharacterString/text()";
	public static final String xPathRSIdCodeSpace = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:RS_Identifier/gmd:codeSpace/gco:CharacterString/text()";
	public static final String xPathKeywords = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword/gco:CharacterString/text()";
	public static final String xPathOrganisation = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString/text()";
	   
	public static final String xPathId = "gmd:fileIdentifier/gco:CharacterString/text()";
	public static final String xPathPartDataSets = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";	
	public static final String xPathOrganisationShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString/text()";
	public static final String xPathDataSetAbstractShort = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:abstract/gco:CharacterString/text()";
	public static final String xPathRessourceType = "gmd:hierarchyLevel/gmd:MD_ScopeCode";
	
	public static final String xPathTimeBegin = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:beginPosition/text()";
	public static final String xPathTimeEnd = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:endPosition/text()";
	public static final String xPathExtentWest = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:westBoundLongitude/gco:Decimal/text()";
	public static final String xPathExtentEast = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:eastBoundLongitude/gco:Decimal/text()";
	public static final String xPathExtentSouth = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:southBoundLatitude/gco:Decimal/text()";
	public static final String xPathExtentNorth = "//gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox/gmd:northBoundLatitude/gco:Decimal/text()";
	
	//linkage
	public static final String xPathOnLineFunction = "//gmd:MD_Metadata/gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:function/gmd:CI_OnLineFunctionCode/@codeListValue";
	public static final String xPathOnLineLink = "//gmd:MD_Metadata/gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:linkage/gmd:URL/text()";
	public static final String xPathUrnLink = "//gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification/srv:containsOperations/srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource/gmd:linkage/gmd:URL/text()";
	
	//lineage information
	public static final String xPathStatement = "gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:statement/gco:CharacterString/text()";
	public static final String xPathStatement2 = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:statement/gco:CharacterString/text()";	
	
	public static final String xPathProcessSteps = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep";
	public static final String xPathPSDescription = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:description/gco:CharacterString/text()";
	public static final String xPathPSDescription2 = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmi:processingInformation/gmi:LE_Processing/gmi:procedureDescription/gco:CharacterString/text()";
	public static final String xPathPSRationale = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:rationale/gco:CharacterString/text()";
	public static final String xPathPSDateTime = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:dateTime/gco:DateTime/text()";
	public static final String xPathPSProcessorOrganisation = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:processor/gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString/text()";;
	public static final String xPathPRIdentifier = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmi:processingInformation/gmi:LE_Processing/gmi:identifier/gmd:MD_Identifier/gmd:code/gco:CharacterString/text()";
	
	public static final String xPathPSDescriptionShort = "gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:description/gco:CharacterString/text()";
	public static final String xPathPSRationaleShort = "gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:rationale/gco:CharacterString/text()";
	public static final String xPathPSProcessorOrganisationShort = "gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:processor/gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString/text()";;
	
	//source
	public static final String xPathSource = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:source/gmd:LI_Source";
	public static final String xPathSourceDescription = "gmd:description/gco:CharacterString/text()";
	public static final String xPathSourceIdentifier = "gmd:sourceCitation/gmd:CI_Citation/gmd:identifier/gmd:RS_Identifier/gmd:code/gco:CharacterString/text()"; 
	public static final String xPathSourceIdentifierSpace = "gmd:sourceCitation/gmd:CI_Citation/gmd:identifier/gmd:RS_Identifier/gmd:codeSpace/gco:CharacterString/text()";
	public static final String xPathSourceDate = "gmd:sourceCitation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date/gco:date/text()";
	public static final String xPathSourceTitle = "gmd:sourceCitation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";
	
	//processing 
	public static final String xPathPInfos = "//gmd:MD_Metadata/gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmi:processingInformation/gmi:LE_Processing";
	public static final String xPathPIdentifier = "gmd:identifier/gmd:MD_Identifier/gmd:code/gco:CharacterString/text()";
	public static final String xPathPRuntimeParams = "gmd:runTimeParameters/gco:CharacterString/text()";
	public static final String xPathPSWReference = "gmd:softwareReference/gmd:CI_Citation"; 
	
	//publication
	public static final String xPathDocumentation = "gmi:documentation/gmd:CI_Citation";
	public static final String xPathCiTitle = "gmd:title/gco:CharacterString/text()";
	public static final String xPathCiAltTitle = "gmd:alternateTitle/text()";
	public static final String xPathCiDate = "gmd:date/gmd:CI_Date/gmd:date/gco:Date/text()"; //TODO: datetype creation filtern?
	public static final String xPathCiIdentifier = "gmd:identifier/gmd:MD_Identifier/gmd:code/gco:CharacterString/text()";
	public static final String xPathCiOtherDetails = "gmd:otherCitationDetails/gco:CharacterString/text()";
		
	//childs/parents
	public static final String xPathParentShort = "gmd:parentIdentifier/gco:CharacterString/text()";
	public static final String xPathParent = "//gmd:MD_Metadata/gmd:parentIdentifier/gco:CharacterString/text()";
	public static final String xPathChildTitle = "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";
	
	// -----------------------------------------------------------------------------------------
	// -- DB-REQUEST (caused by facet selections, bbox choice ----------------------------------
	// in tud.geometafacet.controlling and tud.geometafacet.script
	// -----------------------------------------------------------------------------------------
	
	public static String findAllIds = "findAllIds";
	public static String findOne = "findOne"; 
	public static String findMixedBox = "findMixedBox"; 
	public static String findAllTopics = "findAllTopiccategories";  
	public static String countAllTopiccategories = "countAllTopiccategories"; 
	public static String findAllDatatypes = "findAllDatatypes";  
	public static String countAllDatatypes = "countAllDatatypes"; 
	public static String findAllOrganizations = "findAllOrganizations"; 
	public static String countAllOrganizations = "countAllOrganizations"; 
	public static String countAllHierarchylevelnames = "countAllHierarchylevelnames"; 
	public static String countAllScenarios = "countAllScenarios";
	public static String findAllBoundingboxes = "findAllBoundingboxes";
	public static String countAllBoundingboxes = "countAllBoundingboxes";
	public static String findAllBBox = "findAllBBox";
	public static String findByMixed = "findByMixed";
	public static String findPublicationByDsId = "findPublicationByDsId";
	public static String findSimilarLimited = "findSimilarLimited";
	public static String findSimilarScenarioValues = "findSimilarScenarioValues";
	public static String findSimilarHierarchylevelnameValues = "findSimilarHierarchylevelnameValues";
	public static String findSimilarTopiccategoryValues = "findSimilarTopiccategoryValues";
	public static String findSimilarDatatypeValues = "findSimilarDatatypeValues";
	public static String findSimilarOrganizationValues = "findSimilarOrganizationValues"; 
	public static String findGrandParent = "findGrandParent";
	public static String findTree = "findTree";
	
}
