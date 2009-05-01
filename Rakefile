RELEASE_VERSION = '0.5'
ARCHIVE_NAME = "protodoc-#{RELEASE_VERSION}.tgz"
IGNORE = Dir['**/#*#'] + Dir['**/.#*'] + Dir['build']

task :archive => ARCHIVE_NAME

# task :publish => :archive do
#   sh "rsync -avz . osteele.com:osteele.com/sources/javascript/protodoc --delete"
# end

file ARCHIVE_NAME => Dir['**/*'] - Dir['*.tgz'] - IGNORE do |t|
  sh "tar cfz #{t.name} #{t.prerequisites}"
end

task :doc do
  require 'peg_markdown'
  markdown = open('README.md') do |f| Markdown.new(f.read) end
  mkdir_p 'build' unless File.directory?('build')
  open('build/readme.html', 'w') do |f| f << markdown.to_html end
end
