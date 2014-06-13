var express = require('express'),
metadata = require('./routes/metadata');
 
var app = express();
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}); 
 
app.configure(function () {
app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
});
 
app.get('/metadata', metadata.findAll);
app.get('/metadata/findOne/:id', metadata.findById);
app.get('/metadata/findAllIds', metadata.findAllIds);

app.get('/metadata/findSimilarGeneral/:sim', metadata.findSimilarGeneral);
app.get('/metadata/findSimilarLimited/:sim/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.findSimilarLimited);
app.get('/metadata/findSimilarScenarios/:sim', metadata.findSimilarScenarios);
app.get('/metadata/findSimilarScenarioValues/:sim/:hierarchylevelnames/:topiccategories/:datatypes/:organizations', metadata.findSimilarScenarioValues);
app.get('/metadata/findSimilarHierarchylevelnames/:sim', metadata.findSimilarHierarchylevelnames);
app.get('/metadata/findSimilarHierarchylevelnameValues/:sim/:scenarios/:topiccategories/:datatypes/:organizations', metadata.findSimilarHierarchylevelnameValues);
app.get('/metadata/findSimilarTopiccategory/:sim', metadata.findSimilarTopiccategory);
app.get('/metadata/findSimilarTopiccategoryValues/:sim/:scenarios/:hierarchylevelnames/:datatypes/:organizations', metadata.findSimilarTopiccategoryValues);
app.get('/metadata/findSimilarDatatype/:sim', metadata.findSimilarDatatype);
app.get('/metadata/findSimilarDatatypeValues/:sim/:scenarios/:hierarchylevelnames/:topiccategories/:organizations', metadata.findSimilarDatatypeValues);
app.get('/metadata/findSimilarOrganization/:sim', metadata.findSimilarOrganization);
app.get('/metadata/findSimilarOrganizationValues/:sim/:scenarios/:hierarchylevelnames/:topiccategories/:datatypes', metadata.findSimilarOrganizationValues);

app.get('/metadata/findAllBBox', metadata.findAllBBox);
app.get('/metadata/findMixedBox/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.findMixedBox);

app.get('/metadata/findAllHierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.findAllHierarchylevelnames); 
app.get('/metadata/countAllHierarchylevelnames/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.countAllHierarchylevelnames);

app.get('/metadata/findAllTopiccategories/:hierarchylevelnames/:datatypes/:organizations/:scenarios', metadata.findAllTopiccategories);
app.get('/metadata/findByTopiccategories/:topiccategories', metadata.findByTopiccategories); 
app.get('/metadata/countAllTopiccategories/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.countAllTopiccategories);

app.get('/metadata/findAllDatatypes/:hierarchylevelnames/:topiccategories/:organizations/:scenarios', metadata.findAllDatatypes);
app.get('/metadata/findByDatatypes/:datatypes', metadata.findByDatatypes); 
app.get('/metadata/countAllDatatypes/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.countAllDatatypes);

app.get('/metadata/findAllOrganizations/:hierarchylevelnames/:topiccategories/:datatypes/:scenarios', metadata.findAllOrganizations);
app.get('/metadata/findByOrganizations/:organizations', metadata.findByOrganizations); 
app.get('/metadata/countAllOrganizations/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.countAllOrganizations);

app.get('/metadata/findAllScenarios/:hierarchylevelnames/:topiccategories/:datatypes/:organizations', metadata.findAllScenarios); 
app.get('/metadata/countAllScenarios/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.countAllScenarios);

app.get('/metadata/findRelatedPublication/:id', metadata.findRelatedPublication); 

app.get('/metadata/findGrandParent/:id', metadata.findGrandParent); 
app.get('/metadata/findTree/:id', metadata.findTree);

app.get('/metadata/findByMixed/:hierarchylevelnames/:topiccategories/:datatypes/:organizations/:scenarios', metadata.findByMixed);

app.post('/metadata/AddNewOne', metadata.addMetadata);                        /* delete, when on server */
app.put('/metadata/UpdateOne/:id', metadata.updateMetadata);
app.delete('/metadata/DeleteOne/:id', metadata.deleteMetadata);
 
app.listen(3000);
console.log('Listening on port 3000...');