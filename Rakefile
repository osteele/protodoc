RELEASE_VERSION = '0.5'
ARCHIVE_NAME = "protodoc-#{RELEASE_VERSION}.tgz"
IGNORE = Dir['**/#*#'] + Dir['**/.#*'] + Dir['build']

task :archive => ARCHIVE_NAME

task :publish => :archive do
  sh "rsync -avz . osteele.com:osteele.com/sources/javascript/protodoc --delete"
end

file ARCHIVE_NAME => Dir['**/*'] - Dir['*.tgz'] - IGNORE do |t|
  sh "tar cfz #{t.name} #{t.prerequisites}"
end

