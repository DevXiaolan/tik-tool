FROM docker.elastic.co/beats/filebeat:6.2.4
COPY filebeat.yml /usr/share/filebeat/filebeat.yml
CMD [ "filebeat", "-e","-c","/usr/share/filebeat/filebeat.yml" ]