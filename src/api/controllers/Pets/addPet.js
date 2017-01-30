export default function(req, res, next){
  res.status(201).send({
    name: 'new Fido'
  })
}
