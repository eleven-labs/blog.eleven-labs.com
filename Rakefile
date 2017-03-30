task :default => [:test]

# testsuite
task :test => [:test_build]

# test jekyll build
task :test_build do
  jekyll('build')
end

# launch jekyll
def jekyll(directives = '')
  sh 'jekyll ' + directives
end
