class YouTube < Liquid::Tag
  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

  def initialize(tagName, markup, tokens)
    super

    if markup =~ Syntax then
      @id = $1
    else
      raise "No YouTube ID provided in the \"youtube\" tag"
    end
  end

  def render(context)
    "<div class=\"video-container\"><iframe width=\"100%\" height=\"100%\" src=\"http://www.youtube.com/embed/#{@id}?color=white&theme=light\" frameborder=\"0\" allowfullscreen></iframe></div>"
  end

  Liquid::Template.register_tag "youtube", self
end