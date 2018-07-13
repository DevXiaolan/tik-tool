FROM golang:1.10.3

ADD ./proc_id.go.patch /proc_id.go

RUN git clone http://Administrator:JsL5emqymYF6zsMVdkk2@172.20.160.7:10080/tik-go/core.git /go/src/tik-go/core --config core.autocrlf=input \
  && git clone http://Administrator:JsL5emqymYF6zsMVdkk2@172.20.160.7:10080/tik-go/tik-go.git /go/src/tik-go/tik-go --config core.autocrlf=input \
  && cd /go/src/tik-go/tik-go \
  && go get \
  && go install \
  && cd $(go env GOROOT)/src/runtime \
  && mv /proc_id.go . \
  && go install


